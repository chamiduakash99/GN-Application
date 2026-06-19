package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Fencetype;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FencetypeDao extends JpaRepository<Fencetype, Integer> {

    Fencetype findByName(String name);
}
