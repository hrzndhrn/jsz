package controllers

import play.api.mvc._

/**
 * Created by kruse on 19.07.15.
 */
class Demo extends Controller {

  def load = Action {
    Ok(views.html.demo.load())
  }

  def click = Action {
    Ok(views.html.demo.click())
  }

  def lightOut = Action {
    Ok(views.html.demo.lightOut())
  }
}
