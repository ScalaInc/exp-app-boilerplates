Configuration structure for the application

* **feed_configuration**        : includes the path to the facebook feed from EXP-CORE and a uuid to connect to
* **refresh_rate_seconds**      : the app refreshes the data from the feed url every X seconds
* **date_format**               : Format of the date on the screen see Angular date formats
* **include_item_text_search**  : Text search string for posts that will be included
* **cover_image_landscape**     : URL link to optional cover image for landscape mode. Best resolution 1531x358 at FULL HD. Higher resolution in same aspect is better for resolution above FULL HD.
* **cover_image_portrait**      : URL link to optional cover image for portrait mode. Best resolution 851x315 at FULL HD. Higher resolution in same aspect is better for resolution above FULL HD.
* **page_logo**                 : URL link to optional logo image for portrait and landscape mode. Best resolution 288x288 at FULL HD. Higher resolution in same aspect is better for resolution above FULL HD.

Configuration JSON Example:
```
{
  "feed_configuration": {
    "path": "api/connectors/feeds",
    "uuid": "e3b511dc-ccac-4d1b-8606-e9b430540033"
  },
  "refresh_rate_seconds": "60",
  "date_format":"dd-MM-yyyy HH:mm:ss",
  "include_item_text_search":"e",
  "cover_image_landscape":"http://localhost:9000/files/filename.jpg",
  "cover_image_portrait":"http://localhost:9000/files/filename.jpg",
  "page_logo":"http://localhost:9000/files/filename.jpg"
}
```
