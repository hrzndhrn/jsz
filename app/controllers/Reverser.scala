package controllers

import play.api.mvc._
import play.api.libs.json._

class Reverser extends Controller {

  def reverse = Action(parse.json) { request =>
    (request.body \ "text").asOpt[String].map { text =>
      Ok(Json.obj("text" -> text.reverse))
    }.getOrElse {
      BadRequest("Missing parameter [text]")
    }
  }
}
