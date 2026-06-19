package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Certificaterequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CertificaterequestDao extends JpaRepository<Certificaterequest,Integer> {

    @Query("select cr from Certificaterequest cr where cr.id = :id")
    Certificaterequest findByMyId(@Param("id") Integer id);

    @Query("SELECT NEW Certificaterequest(cr.id, cr.purpose) FROM Certificaterequest cr")
    List<Certificaterequest> findAllNameId();

    @Query("SELECT cr.requeststatus.name, COUNT(cr) " +
            "FROM Certificaterequest cr " +
            "GROUP BY cr.requeststatus.name")
    List<Object[]> getStatusSummary();

}