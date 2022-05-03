FROM golang:latest AS build-skeema

RUN go install github.com/skeema/skeema@latest

FROM golang:latest
COPY --from=build-skeema /go/bin/skeema /go/bin/skeema
