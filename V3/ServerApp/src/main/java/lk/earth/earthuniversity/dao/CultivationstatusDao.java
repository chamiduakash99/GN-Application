package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Cultivationstatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CultivationstatusDao extends JpaRepository<Cultivationstatus, Integer> {

    @Query("select new Cultivationstatus(s.id, s.name) from Cultivationstatus s")
    List<Cultivationstatus> findAllNameId();
}