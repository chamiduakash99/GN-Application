package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Treepermissionstatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TreepermissionstatusDao extends JpaRepository<Treepermissionstatus, Integer> {

    @Query("select new Treepermissionstatus(s.id, s.name) from Treepermissionstatus s")
    List<Treepermissionstatus> findAllNameId();
}