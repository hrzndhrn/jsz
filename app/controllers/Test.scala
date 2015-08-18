package controllers

import _root_.itemStore.Items
import play.api.mvc._

/**
 * Created by kruse on 21.07.15.
 */
class Test extends Controller {

  def page(page:String) = Action {
    page match {
      case "test" => Ok(views.html.test.test())
      case "testCase" => Ok(views.html.test.testCase())
      case "testSession" => Ok(views.html.test.testSession())
      case "unit/testCase" => Ok(views.html.test.unit.testCase())
      case "util/timerTask" => Ok(views.html.test.util.timerTask())
      case "jsz/util/format" => Ok(views.html.test.jsz.util.format())
      case "core/all" => Ok(views.html.test.core.all())
      case "core/isType" => Ok(views.html.test.core.isType())
      case "core/array" => Ok(views.html.test.core.array())
      case "core/dollar" => Ok(views.html.test.core.dollar())
      case "core/attributes" => Ok(views.html.test.core.attributes())
      case "core/default" => Ok(views.html.test.core.default())
      case "core/args" => Ok(views.html.test.core.args())
      case "core/json" => Ok(views.html.test.core.JSON())
      case "http" => Ok(views.html.test.http())
      case "itemStore" => {
        // Drop all items in item store for the test.
        Items.drop
        Ok(views.html.test.itemStore.items())
      }
      case _ => NotFound
    }
  }

}
