package itemStore

import itemStore.models.Item
import org.joda.time.DateTime
import play.api.Logger

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
             quantity: Int): Option[Item]

  def get(id: String): Option[Item]

  def update(id: String,
             name: String,
             description: Option[String],
             price: Double,
             quantity: Int): Option[Item]


  def delete(id: String): Boolean
}

object Items extends Items {

  private val items = Ref(SortedMap.empty[String, Item])
  private val seq = Ref(0L)

  def list: Iterable[Item] = {
    Logger.debug("Return list - Items count : %d".format(items.single().size))
    items.single().values
  }

  def create(name: String,
             description: Option[String],
             price: Double,
             quantity: Int): Option[Item] = {

    Logger.debug("Create an item.")
    val id = seq.single.transformAndGet(_ + 1).toString
    val item = Item(id, name, description, price, quantity, DateTime.now)
    items.single.transform(_ + (id -> item))
    items.single().size
    Logger.debug("Items count : %d".format(items.single().size))
    Some(item)
  }

  def get(id: String): Option[Item] = items.single().get(id)

  def update(id: String,
             name: String,
             description: Option[String],
             price: Double,
             quantity: Int): Option[Item] = atomic { implicit txn =>
    if (items().get(id).isDefined) {
      items.transform(_.updated(
        id, Item(id, name, description, price, quantity, DateTime.now)))
    }
    items().get(id)
  }

  def delete(id: String): Boolean = atomic { implicit txn =>
    if (items().isDefinedAt(id)) {
      Logger.debug("delete " + id);
      items.transform(_ - id)
      true
    } else {
      false
    }
  }

  def drop = atomic { implicit txn =>
    items.transform(_ drop items.single().size)
  }

}
