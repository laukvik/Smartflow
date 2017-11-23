import {ServerAction} from "../../../src/Action";

export class PhotoOfTheDayAction extends ServerAction {

  getSmartflow() {
    return {
      "request": {
        "url": "https://www.nationalgeographic.com/photography/photo-of-the-day/_jcr_content/.gallery.json",
        "method": "get",
        "type": "json"
      },
      "success": {
        "global": "gallery",
      },
      "error": {
        "global": "galleryFailed"
      }
    }
  }
}
