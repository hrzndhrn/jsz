package controllers

import play.api.mvc._
import play.api.libs.json.Json

class Reverser {

  def reverse(string:String) = Action {
    Ok(Json.obj(
      "string" -> string.reverse
    ))
  }
}
