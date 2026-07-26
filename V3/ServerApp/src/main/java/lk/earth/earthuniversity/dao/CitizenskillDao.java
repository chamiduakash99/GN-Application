package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Citizenskill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CitizenskillDao extends JpaRepository<Citizenskill, Integer> {

    @Query("select s from Citizenskill s where s.citizen.id = :citizenId")
    List<Citizenskill> findByCitizenId(Integer citizenId);

    @Query("select s from Citizenskill s where s.profession.id = :professionId")
    List<Citizenskill> findByProfessionId(Integer professionId);
}