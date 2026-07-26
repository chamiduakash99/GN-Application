package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Treecuttingrequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TreecuttingrequestDao extends JpaRepository<Treecuttingrequest, Integer> {

    @Query("select r from Treecuttingrequest r where r.citizen.id = :citizenId")
    List<Treecuttingrequest> findByCitizenId(Integer citizenId);

    @Query("select r from Treecuttingrequest r where r.treepermissionstatus.id = :statusId")
    List<Treecuttingrequest> findByStatusId(Integer statusId);

    @Query("SELECT t.treepermissionstatus.name, COUNT(t) FROM Treecuttingrequest t GROUP BY t.treepermissionstatus.name")
    List<Object[]> getStatusSummary();
}