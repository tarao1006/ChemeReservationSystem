FROM golang:latest AS build-skeema

RUN go get -u github.com/skeema/skeema

FROM golang:latest
COPY --from=build-skeema /go/bin/skeema /go/bin/skeema
