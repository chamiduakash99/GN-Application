package lk.earth.earthuniversity.report.dao;

import lk.earth.earthuniversity.entity.Street;
import lk.earth.earthuniversity.report.entity.CountByStreetMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CountByStreetMaterialDao extends JpaRepository<Street, Integer> {

    @Query("SELECT NEW lk.earth.earthuniversity.report.entity.CountByStreetMaterial(sm.name, COUNT(s.id)) " +
            "FROM Street s JOIN s.streetmatierial sm GROUP BY sm.id, sm.name")
    List<CountByStreetMaterial> countByStreetMaterial();

}
