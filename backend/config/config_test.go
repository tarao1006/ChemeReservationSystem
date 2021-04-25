package config

import "testing"

func TestPort(t *testing.T) {
	tests := []struct {
		name string
		want string
	}{
		{
			name: "正しく取得できる",
			want: "1234",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := Port(); got != tt.want {
				t.Errorf("Port() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestSecretKey(t *testing.T) {
	tests := []struct {
		name string
		want string
	}{
		{
			name: "正しく取得できる",
			want: "secret_key",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := string(SecretKey()); got != tt.want {
				t.Errorf("SecretKey() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestRememberMeTokenSecretKey(t *testing.T) {
	tests := []struct {
		name string
		want string
	}{
		{
			name: "正しく取得できる",
			want: "remember_me_token_secret_key",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := string(RememberMeTokenSecretKey()); got != tt.want {
				t.Errorf("RememberMeTokenSecretKey() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestRememberTokenKey(t *testing.T) {
	tests := []struct {
		name string
		want string
	}{
		{
			name: "正しく取得できる",
			want: "remember_token_key",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := RememberTokenKey(); got != tt.want {
				t.Errorf("RememberTokenKey() = %v, want %v", got, tt.want)
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

func TestCookieName(t *testing.T) {
	tests := []struct {
		name string
		want string
	}{
		{
			name: "正しく取得できる",
			want: "cookie_name",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := CookieName(); got != tt.want {
				t.Errorf("CookieName() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestIdentityKey(t *testing.T) {
	tests := []struct {
		name string
		want string
	}{
		{
			name: "正しく取得できる",
			want: "identity_key",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := IdentityKey(); got != tt.want {
				t.Errorf("IdentityKey() = %v, want %v", got, tt.want)
			}
		})
	}
}
