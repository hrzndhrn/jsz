package itemStore

import itemStore.models.Item
import org.joda.time.DateTime

import scala.collection.immutable.SortedMap
import scala.concurrent.stm._

/**
 * Created by kruse on 12.08.15.
 */
trait Items {
  def list: Iterable[Item]

  def create(name: String,
             description: Option[String],
             price: Double,
             quantity: Integer): Option[Item]

  def get(id: String): Option[Item]

  def update(id: String,
             name: String,
             description: Option[String],
             price: Double,
             quantity: Integer): Option[Item]


  def delete(id: String): Boolean
}

object Items extends Items {

  private val items = Ref(SortedMap.empty[String, Item])
  private val seq = Ref(0L)

  def list: Iterable[Item] = items.single().values

  def create(name: String,
             description: Option[String],
             price: Double,
             quantity: Integer): Option[Item] = {

    val id = seq.single.transformAndGet(_ + 1).toString
    val item = Item(id, name, description, price, quantity, new DateTime)
    items.single.transform(_ + (id -> item))
    Some(item)
  }

  def get(id: String): Option[Item] = items.single().get(id)

  def update(id: String,
             name: String,
             description: Option[String],
             price: Double,
             quantity: Integer): Option[Item] = atomic { implicit txn =>
    if (items().get(id).isDefined) {
      items.transform(_.updated(
        id, Item(id, name, description, price, quantity, new DateTime)))
    }
    items().get(id)
  }

  def delete(id: String): Boolean = atomic { implicit txn =>
    if (items().isDefinedAt(id)) {
      items.transform(_ - id)
      true
    } else {
      false
    }
  }

}
