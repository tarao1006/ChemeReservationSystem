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
