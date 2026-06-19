package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Aidprogram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AidprogramDao extends JpaRepository<Aidprogram, Integer> {

    Aidprogram findByName(String name);
}