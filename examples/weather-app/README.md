Configuration structure for the application

* **feed_configuration**    : includes the path to the weather feed from EXP-CORE and a id to connect to
* **refresh_rate_seconds**  : the app refreshes the data from the feed url every X seconds
* **date_format**           : Format of the date on the screen see Angular date formats
* **icon_set**              : folder name in the assets/icons folder that contains the icons, you can add folders here with > different icon sets. Names of the files is listed in the API feed. Resolution on 500 × 460
* **temperature**          : c for celsius and f for fahrenheit
* **measurements**          : metric or imperial
* **temperature_range_c**   : depending on the temperature celsius the app will have a different color style
* **temperature_range_f**   : depending on the temperature fahrenheit the app will have a different color style

Configuration JSON Example:
```
{
  "feed_configuration": {
    "path": "api/connectors/feeds/weather"
    "search_id": "302"
  },
  "refresh_rate_seconds": "900",
  "date_format": "EEEE",
  "icon_set": "set1",
  "temperature": "c",
  "measurements": "metric",
  "temperature_range_c": [
    {
      "upper_value": "15",
      "theme": "theme1"
    },
    {
      "upper_value": "25",
      "theme": "theme2"
    },
    {
      "upper_value": "60",
      "theme": "theme3"
    }
  ],
  "temperature_range_f": [
    {
      "upper_value": "59",
      "theme": "theme1"
    },
    {
      "upper_value": "77",
      "theme": "theme2"
    },
    {
      "upper_value": "140",
      "theme": "theme3"
    }
  ]
}
```
