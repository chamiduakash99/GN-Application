package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Requeststatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RequeststatusDao extends JpaRepository<Requeststatus,Integer> {

    @Query("SELECT NEW Requeststatus(rs.id, rs.name) FROM Requeststatus rs")
    List<Requeststatus> findAllNameId();

}