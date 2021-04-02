FROM golang:latest AS build-air

RUN go get -u github.com/cosmtrek/air

FROM golang:latest
COPY --from=build-air /go/bin/air /go/bin/air

WORKDIR /app

COPY go.mod .
RUN go mod download

COPY . .

EXPOSE 8000
