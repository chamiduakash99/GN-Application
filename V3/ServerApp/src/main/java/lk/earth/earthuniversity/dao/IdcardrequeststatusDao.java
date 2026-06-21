package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Idcardrequeststatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface IdcardrequeststatusDao extends JpaRepository<Idcardrequeststatus, Integer> {

    @Query("select new Idcardrequeststatus(s.id, s.name) from Idcardrequeststatus s")
    List<Idcardrequeststatus> findAllNameId();
}