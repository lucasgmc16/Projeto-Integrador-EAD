<?php
class JwtHandler {
    private $secret_key = "teamap_secret_key_2025_mude_isso_em_producao";
    private $issuer = "teamap.com";
    private $audience = "teamap_users";
    
    public function encode($user_id, $email) {
        $issuedAt = time();
        $expire = $issuedAt + (60 * 60 * 24 * 30);
        
        $payload = [
            'iat' => $issuedAt,
            'exp' => $expire,
            'iss' => $this->issuer,
            'aud' => $this->audience,
            'data' => [
                'user_id' => $user_id,
                'email' => $email
            ]
        ];
        
        return $this->generate($payload);
    }
    
    public function decode($jwt) {
        try {
            $parts = explode('.', $jwt);
            
            if (count($parts) !== 3) {
                return false;
            }
            
            $header = json_decode($this->base64UrlDecode($parts[0]), true);
            $payload = json_decode($this->base64UrlDecode($parts[1]), true);
            $signature = $this->base64UrlDecode($parts[2]);
            
            $valid_signature = hash_hmac(
                'sha256',
                $parts[0] . '.' . $parts[1],
                $this->secret_key,
                true
            );
            
            if ($signature !== $valid_signature) {
                return false;
            }
            
            if (isset($payload['exp']) && $payload['exp'] < time()) {
                return false;
            }
            
            return $payload;
            
        } catch (Exception $e) {
            return false;
        }
    }
    
    private function generate($payload) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload = json_encode($payload);
        
        $base64UrlHeader = $this->base64UrlEncode($header);
        $base64UrlPayload = $this->base64UrlEncode($payload);
        
        $signature = hash_hmac(
            'sha256',
            $base64UrlHeader . "." . $base64UrlPayload,
            $this->secret_key,
            true
        );
        
        $base64UrlSignature = $this->base64UrlEncode($signature);
        
        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }
    
    private function base64UrlEncode($text) {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($text));
    }
    
    private function base64UrlDecode($text) {
        return base64_decode(str_replace(['-', '_'], ['+', '/'], $text));
    }
}
?>