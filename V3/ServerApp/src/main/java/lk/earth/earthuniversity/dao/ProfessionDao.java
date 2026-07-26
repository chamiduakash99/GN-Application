package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Profession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProfessionDao extends JpaRepository<Profession, Integer> {

    @Query("select new Profession(p.id, p.name) from Profession p")
    List<Profession> findAllNameId();
}