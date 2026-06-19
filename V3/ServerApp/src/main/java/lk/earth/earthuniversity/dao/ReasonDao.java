package lk.earth.earthuniversity.dao;


import lk.earth.earthuniversity.entity.Reason;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ReasonDao extends JpaRepository<Reason, Integer> {


    @Query("select r from Reason r where r.id = :id")
    Reason findByMyId(Integer id);



    @Query("select r from Reason r")
    List<Reason> findAllNameId();


}