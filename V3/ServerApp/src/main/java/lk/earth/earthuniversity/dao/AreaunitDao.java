package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Areaunit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AreaunitDao extends JpaRepository<Areaunit, Integer> {

    @Query("select new Areaunit(a.id, a.name) from Areaunit a")
    List<Areaunit> findAllNameId();
}