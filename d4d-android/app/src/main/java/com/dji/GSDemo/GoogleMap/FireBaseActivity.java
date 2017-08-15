package com.dji.GSDemo.GoogleMap;

//import android.app.Dialog;
import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.Menu;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.Toast;

import com.firebase.client.ChildEventListener;
import com.firebase.client.DataSnapshot;
import com.firebase.client.Firebase;
import com.firebase.client.FirebaseError;

import com.dji.GSDemo.GoogleMap.Data.Mission;

import java.util.ArrayList;

import static com.firebase.client.DataSnapshot.*;

public class FireBaseActivity extends AppCompatActivity {
    private static final String TAG = DJIDemoApplication.class.getName();
    final static String DB_URL = "https://dengue-map-1.firebaseio.com/";
    Firebase fire;
    ArrayList<String> names = new ArrayList<>();
    ArrayList<String> dataArray = new ArrayList<>();
    ArrayAdapter<String> adapter;
    ListView lv;
    EditText inputSearch;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_firebase);
//        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
//        setSupportActionBar(toolbar);

        lv = (ListView) findViewById(R.id.lv);
        Firebase.setAndroidContext(this);
        fire = new Firebase(DB_URL);
        this.returnData();
        inputSearch = (EditText) findViewById(R.id.inputSearch);
        inputSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                FireBaseActivity.this.adapter.getFilter().filter(s);
            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });

/****************************************************************************************************/
        lv.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                //Toast.makeText(getApplicationContext(), names.get(position), Toast.LENGTH_LONG).show();
                Intent detail1 = new Intent(parent.getContext(), MainActivity.class);
                detail1.putExtra("name", names.get(position));
                detail1.putExtra("data", dataArray.get(position));
                startActivity(detail1);
            }
        });
//        sv.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
//            @Override
//            public boolean onQueryTextSubmit(String text) {
//                return false;
//            }
//            @Override
//            public boolean onQueryTextChange(String text) {
//                adapter.getFilter().filter(text);
//                return false;
//            }
//        });

        /*
        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
//                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
//                        .setAction("Action", null).show();
                showDialog();
            }
        });
        */
    }

    /*
    private void showDialog() {
        Dialog d = new Dialog(this);
        d.setTitle("Save Online");
        d.setContentView(R.layout.show_details);

        nameT = (EditText) d.findViewById(R.id.nameEditText);
        dataT = (EditText) d.findViewById(R.id.descEditText);
        saveBtn = (Button) d.findViewById(R.id.saveBtn);

        saveBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                addData(nameT.getText().toString(), dataT.getText().toString());
                nameT.setText("");
                dataT.setText("");
            }
        });
        d.show();
    }
    */

    /*
    private void addData(String name, String data) {
        Mission m = new Mission();
        m.setName(name);
        m.setData(data);
        fire.child("mission").push().setValue(m);
    }
    */


    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    private void returnData() {
        fire.addChildEventListener(new ChildEventListener() {

            @Override
            public void onChildAdded(DataSnapshot dataSnapshot, String s) {
                getUpdates(dataSnapshot);
            }

            @Override
            public void onChildChanged(DataSnapshot dataSnapshot, String s) {
                getUpdates(dataSnapshot);
            }

            @Override
            public void onChildRemoved(DataSnapshot dataSnapshot) {

            }

            @Override
            public void onChildMoved(DataSnapshot dataSnapshot, String s) {

            }

            @Override
            public void onCancelled(FirebaseError firebaseError) {

            }
        });
    }

    private void getUpdates(DataSnapshot ds) {
        names.clear();
        for (DataSnapshot data : ds.getChildren()) {
            Mission m = new Mission();
            m.setName(data.getValue(Mission.class).getName());
            m.setData(data.getValue(Mission.class).getData());
            names.add(m.getName());
            dataArray.add(m.getData());
            Log.d(TAG,"name:"+m.getName());
        }
        if (names.size() > 0) {
            adapter = new ArrayAdapter<>(FireBaseActivity.this, android.R.layout.simple_list_item_1, names);
            lv.setAdapter(adapter);
        } else {
            Toast.makeText(FireBaseActivity.this, "No Data", Toast.LENGTH_SHORT).show();
        }

    }
}
