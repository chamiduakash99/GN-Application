package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Idcardrequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface IdcardrequestDao extends JpaRepository<Idcardrequest, Integer> {

    @Query("select r from Idcardrequest r where r.citizen.id = :citizenId")
    List<Idcardrequest> findByCitizenId(Integer citizenId);
}