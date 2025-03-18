# actual-ical
---

A simple application to expose Actual Scheduled Transactions in iCal format.

## Usage

Just run the docker image

```bash
docker run -d -p 3000:3000 \
  -e ACTUAL_SERVER=actual.example.com \
  -e ACTUAL_MAIN_PASSWORD=mainpassword \
  -e ACTUAL_SYNC_ID=syncid \
  ghcr.io/matheusvellone/actual-ical
```

Or with docker-compose

```yaml
services:
  actual-ical:
    image: ghcr.io/matheusvellone/actual-ical
    ports:
      - 3000:3000
    environment:
      ACTUAL_SERVER: actual.example.com
      ACTUAL_MAIN_PASSWORD: mainpassword
      ACTUAL_SYNC_ID: syncid
```

Then you can access the iCal feed at `http://localhost:3000/actual.ics`

## Configuration

All configuration is done through environment variables.

|Name|Description|Required|Default|
|---|---|---|---|
|ACTUAL_SERVER|The server to use when connecting to the Actual API|true||
|ACTUAL_MAIN_PASSWORD|The password to use when connecting to the Actual API|true||
|ACTUAL_SYNC_ID|The sync ID to use when connecting to the Actual API|true||
|ACTUAL_SYNC_PASSWORD|The sync password to use when connecting to the Actual API|false||
|ACTUAL_PATH|The path to use when connecting to the Actual API|false|.actual-cache|
|TZ|The timezone to use on ical data|false|UTC|
|PORT|The port to listen on|false|3000|
|LOCALE|The locale to use when formatting amounts|false|en-US|
|CURRENCY|The currency to use when formatting amounts|false|USD|
