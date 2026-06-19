package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Religion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReligionDao extends JpaRepository<Religion, Integer> {

    Religion findByName(String name);
}