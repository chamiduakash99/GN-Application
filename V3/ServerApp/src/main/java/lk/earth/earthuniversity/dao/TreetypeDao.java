package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Landtype;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LandtypeDao extends JpaRepository<Landtype, Integer> {

    Landtype findByName(String name);
}
