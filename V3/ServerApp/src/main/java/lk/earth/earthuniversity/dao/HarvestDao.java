package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Harvest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface HarvestDao extends JpaRepository<Harvest, Integer> {

    @Query("select h from Harvest h where h.cultivation.id = :cultivationId order by h.harvestdate desc")
    List<Harvest> findByCultivationId(Integer cultivationId);
}