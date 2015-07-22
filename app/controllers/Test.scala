package controllers

import play.api.mvc._

/**
 * Created by kruse on 21.07.15.
 */
class Test extends Controller {

  def test = Action(
    Ok(views.html.test.test())
  )
}
