package config

import "testing"

func TestSecretKeyAccessToken(t *testing.T) {
	tests := []struct {
		name string
		want string
	}{
		{
			name: "正しく取得できる",
			want: "secret_key_access_token",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := string(SecretKeyAccessToken()); got != tt.want {
				t.Errorf("SecretKeyAccessToken() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestSecretKeyAccessTokenRememberMeToken(t *testing.T) {
	tests := []struct {
		name string
		want string
	}{
		{
			name: "正しく取得できる",
			want: "secret_key_remember_me_token",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := string(SecretKeyRememberMeToken()); got != tt.want {
				t.Errorf("SecretKeyRememberMeToken() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestCookieNameAccessToken(t *testing.T) {
	tests := []struct {
		name string
		want string
	}{
		{
			name: "正しく取得できる",
			want: "cookie_name_access_token",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := CookieNameAccessToken(); got != tt.want {
				t.Errorf("CookieNameAccessToken() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestCookieNameRememberMeToken(t *testing.T) {
	tests := []struct {
		name string
		want string
	}{
		{
			name: "正しく取得できる",
			want: "cookie_name_remember_me_token",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := CookieNameRememberMeToken(); got != tt.want {
				t.Errorf("CookieNameRememberMeToken() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestIdentityKeyAccessToken(t *testing.T) {
	tests := []struct {
		name string
		want string
	}{
		{
			name: "正しく取得できる",
			want: "key_access_token",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := IdentityKeyAccessToken(); got != tt.want {
				t.Errorf("IdentityKeyAccessToken() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestIdentityKeyRememberMeToken(t *testing.T) {
	tests := []struct {
		name string
		want string
	}{
		{
			name: "正しく取得できる",
			want: "key_remember_me_token",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := IdentityKeyRememberMeToken(); got != tt.want {
				t.Errorf("IdentityKeyRememberMeToken() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestRealm(t *testing.T) {
	tests := []struct {
		name string
		want string
	}{
		{
			name: "正しく取得できる",
			want: "realm",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := Realm(); got != tt.want {
				t.Errorf("Realm() = %v, want %v", got, tt.want)
			}
		})
	}
}
