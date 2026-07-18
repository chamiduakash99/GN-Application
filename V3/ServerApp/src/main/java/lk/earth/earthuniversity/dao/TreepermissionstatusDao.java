package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Treetype;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TreepermissionstatusDao extends JpaRepository<Treetype, Integer> {

    @Query("select new Treetype(t.id, t.name) from Treetype t")
    List<Treetype> findAllNameId();
}