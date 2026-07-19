package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Croptype;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CroptypeDao extends JpaRepository<Croptype, Integer> {

    @Query("select new Croptype(c.id, c.name) from Croptype c")
    List<Croptype> findAllNameId();
}