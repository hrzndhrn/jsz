package controllers

import play.api.mvc._

/**
 * Created by kruse on 19.07.15.
 */
class Demo extends Controller {

  def page(page:String) = Action {
    page match {
      case "load" => Ok(views.html.demo.load())
      case "click" => Ok(views.html.demo.click())
      case "lightsOut" => Ok(views.html.demo.lightsOut())
      case "logging" => Ok(views.html.demo.logging())
      case "testSession" => Ok(views.html.demo.jsz.unit.testSession())
      case "loadedScripts/preload" => Ok(views.html.demo.jsz.loadedScripts.pre())
      case "loadedScripts/dev" => Ok(views.html.demo.jsz.loadedScripts.dev())
      case _ => NotFound
    }
  }

}
