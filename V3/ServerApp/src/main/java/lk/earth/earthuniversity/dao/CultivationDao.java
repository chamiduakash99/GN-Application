package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Cultivation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CultivationDao extends JpaRepository<Cultivation, Integer> {

    @Query("select new Cultivation(c.id, c.cultivationno) from Cultivation c")
    List<Cultivation> findAllNameId();

    @Query("select c from Cultivation c where c.citizen.id = :citizenId")
    List<Cultivation> findByCitizenId(Integer citizenId);

    @Query("select c from Cultivation c where c.landdetail.id = :landdetailId")
    List<Cultivation> findByLanddetailId(Integer landdetailId);
}