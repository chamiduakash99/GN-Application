package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CertificateDao extends JpaRepository<Certificate,Integer> {

    Certificate findByCetificateno(String cetificateno);

    @Query("select c from Certificate c where c.id = :id")
    Certificate findByMyId(@Param("id") Integer id);

    @Query("SELECT NEW Certificate(c.id, c.cetificateno) FROM Certificate c")
    List<Certificate> findAllNameId();

}