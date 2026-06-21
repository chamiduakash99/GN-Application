package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Reason;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReasonDao extends JpaRepository<Reason, Integer> {

    @Query("select new Reason(r.id, r.name) from Reason r")
    List<Reason> findAllNameId();
}