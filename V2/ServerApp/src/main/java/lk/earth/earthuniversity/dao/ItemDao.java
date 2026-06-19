package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Item;
import lk.earth.earthuniversity.entity.Usetype;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ItemDao extends JpaRepository<Item,Integer> {

    @Query("SELECT i FROM Item i WHERE i.code = :code")
    Item findByItemCode(@Param("code") String code);

    @Query("SELECT i FROM Item i WHERE i.name = :name")
    Item findByItemName(@Param("name") String name);

    @Query("SELECT i FROM Item i WHERE i.id = :id")
    Item findByMyId(@Param("id") Integer id);
}
