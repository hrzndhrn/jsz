package itemStore

import org.specs2.mutable._

/**
 * Created by kruse on 12.08.15.
 */
class ItemsSpec  extends Specification{

  "Items" should {
    "be empty" in {
      itemStore.Items.list must be empty
    }

    "have 1 element after add" in {
      itemStore.Items.create("foo", Some("fooFoo"), 2.5, 100)
      itemStore.Items.list must have size(1)
    }

    "have 2 element after add" in {
      itemStore.Items.create("bar", Some("barBar"), 2.5, 100)
      itemStore.Items.list must have size(2)
    }

    "get one by id" in {
      val ids = itemStore.Items.list.map(item => item.id).toArray
      itemStore.Items.get(ids(0)).get.name must beEqualTo("foo")
      itemStore.Items.get(ids(1)).get.name must beEqualTo("bar")
    }

    "be empty after delete all" in {
      val ids = itemStore.Items.list.map(item => item.id)

      for( id <- ids) {
        itemStore.Items.delete(id)
      }

      itemStore.Items.list must be empty
    }
  }
}
