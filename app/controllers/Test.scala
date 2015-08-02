package controllers

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
      case "core/all" => Ok(views.html.test.core.all())
      case "core/isType" => Ok(views.html.test.core.isType())
      case "core/array" => Ok(views.html.test.core.array())
      case _ => NotFound
    }
  }

}
