package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Certificatetype;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CertificatetypeDao extends JpaRepository<Certificatetype,Integer> {

    @Query("SELECT NEW Certificatetype(ct.id, ct.name) FROM Certificatetype ct")
    List<Certificatetype> findAllNameId();

}