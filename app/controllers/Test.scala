package controllers

import _root_.itemStore.Items
import play.api.mvc._

/**
 * Created by kruse on 21.07.15.
 */
class Test extends Controller {

  def page(page:String) = Action {
    page match {
      case "jsz/unit/testCase" => Ok(views.html.test.jsz.unit.testCase())
      case "jsz/util/timerTask" => Ok(views.html.test.jsz.util.timerTask())
      case "jsz/util/format" => Ok(views.html.test.jsz.util.format())
      case "jsz/core/all" => Ok(views.html.test.jsz.core.all())
      case "jsz/core/isType" => Ok(views.html.test.jsz.core.isType())
      case "jsz/core/array" => Ok(views.html.test.jsz.core.array())
      case "jsz/core/dollar" => Ok(views.html.test.jsz.core.dollar())
      case "jsz/core/attributes" => Ok(views.html.test.jsz.core.attributes())
      case "jsz/core/default" => Ok(views.html.test.jsz.core.default())
      case "jsz/core/args" => Ok(views.html.test.jsz.core.args())
      case "jsz/core/json" => Ok(views.html.test.jsz.core.JSON())
      case "jsz/httpRequest" => Ok(views.html.test.jsz.httpRequest())
      case "jsz/observer" => Ok(views.html.test.jsz.observer())
      case "itemStore" => {
        // Drop all items in item store for the test.
        Items.drop
        Ok(views.html.test.itemStore.items())
      }
      case _ => NotFound
    }
  }

}
