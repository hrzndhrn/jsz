package itemStore.models

import org.joda.time.DateTime
import play.api.libs.json.{Json, Writes, Reads}

/**
 * Some classes for the REST-Test.
 */
case class Item(id: String,
                name: String,
                description: Option[String],
                price: Double,
                quantity: Int,
                updatedAt: DateTime)

object Item {
  val dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
  implicit val jodaDateTimeReads = Reads.jodaDateReads(dateFormat)
  implicit val jodaDateTimeWrites = Writes.jodaDateWrites(dateFormat)
  implicit val itemWrites = Json.writes[Item]

}