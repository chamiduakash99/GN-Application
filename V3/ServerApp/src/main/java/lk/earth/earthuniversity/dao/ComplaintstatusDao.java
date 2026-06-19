package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Complaintstatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ComplaintstatusDao extends JpaRepository<Complaintstatus, Integer> {

    @Query("select new Complaintstatus(cs.id, cs.name) from Complaintstatus cs")
    List<Complaintstatus> findAllNameId();

}