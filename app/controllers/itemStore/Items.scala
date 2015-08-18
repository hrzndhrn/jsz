package controllers.itemStore

import itemStore.models.Item
import org.joda.time.DateTime
import org.joda.time.format.ISODateTimeFormat
import play.api.Logger
import play.api.mvc._
import play.api.libs.json._
import play.api.libs.json.Writes._


case class CreateItem(name: String,
                      description: String,
                      price: Double,
                      quantity: Int)

object CreateItem {

  import play.api.libs.functional.syntax._

  implicit val readsCreateItem = (
    (__ \ "name").read(Reads.minLength[String](1)) and
      (__ \ "description").read[String] and
      (__ \ "price").read(Reads.min[Double](0)) and
      (__ \ "quantity").read(Reads.min[Int](0))
    )(CreateItem.apply _)
}

/**
 * The controller for the REST-Test
 */
class Items extends Controller {

  def list = Action {
    Ok(Json.toJson(itemStore.Items.list))
  }

  def create = Action(parse.json) { request =>
    request.body.validate[CreateItem] match {
      case JsSuccess(createItem, _) =>
        itemStore.Items.create(
          createItem.name,
          Option(createItem.description),
          createItem.price,
          createItem.quantity) match {
          case Some(item) => Ok(Json.toJson(item))
          case None => InternalServerError
        }
      case JsError(errors) =>
        BadRequest
    }
  }

  def read(id: String) = Action {
    itemStore.Items.get(id) match {
      case Some(item) => Ok(Json.toJson(item))
      case None => NotFound
    }
  }

  def update(id: String) = Action(parse.json) { implicit request =>
    request.body.validate[CreateItem] match {
      case JsSuccess(updateItem, _) =>
        itemStore.Items.update(id,
          updateItem.name,
          Option(updateItem.description),
          updateItem.price,
          updateItem.quantity) match {
          case Some(item) => Ok(Json.toJson(item))
          case None => InternalServerError
        }
      case JsError(errors) =>
        BadRequest
    }
  }


  def delete(id: String) = Action {
    if (itemStore.Items.delete(id)) {
      Ok(Json.obj("deleted" -> id))
    } else {
      BadRequest
    }
  }

}


