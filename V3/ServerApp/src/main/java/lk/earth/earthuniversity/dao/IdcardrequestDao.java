package lk.earth.earthuniversity.dao;


import lk.earth.earthuniversity.entity.Idcardrequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface IdcardrequestDao
        extends JpaRepository<Idcardrequest, Integer> {



    @Query("select i from Idcardrequest i where i.id = :id")
    Idcardrequest findByMyId(@Param("id") Integer id);



    @Query("select i from Idcardrequest i")
    List<Idcardrequest> findAllNameId();



    @Query("SELECT i.idcardrequeststatus.name, COUNT(i) " +
            "FROM Idcardrequest i " +
            "GROUP BY i.idcardrequeststatus.name")
    List<Object[]> getStatusSummary();


}