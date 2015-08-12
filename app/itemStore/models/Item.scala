package itemStore.models

import org.joda.time.DateTime

import scala.concurrent.stm.{Ref, atomic}

/**
 * Some classes for the REST-Test.
 */
case class Item(id: String,
                name: String,
                description: Option[String],
                price: Double,
                quantity: Integer,
                updateAt: DateTime)

