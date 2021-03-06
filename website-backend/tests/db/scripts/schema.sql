PGDMP                         x            db3xr    9.6.19    12.2    ?           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            ?           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            ?           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            ?           1262    16407    db3xr    DATABASE     u   CREATE DATABASE db3xr WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF8' LC_CTYPE = 'en_US.UTF8';
    DROP DATABASE db3xr;
                cloudsqlsuperuser    false            ?           0    0    SCHEMA public    ACL     ?   REVOKE ALL ON SCHEMA public FROM cloudsqladmin;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO cloudsqlsuperuser;
GRANT ALL ON SCHEMA public TO PUBLIC;
                   cloudsqlsuperuser    false    3            E           1259    35638    SequelizeMeta    TABLE     R   CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);
 #   DROP TABLE public."SequelizeMeta";
       public            postgres    false            s           1259    44885    asset_ab_alternatives    TABLE     q  CREATE TABLE public.asset_ab_alternatives (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    asset_id integer NOT NULL,
    banner_button_text character varying(255),
    camera_orbit character varying(255),
    camera_target character varying(255),
    hdr character varying(255),
    probability_weight integer DEFAULT 1,
    product_name character varying(255),
    product_price character varying(255),
    product_subtitle character varying(255),
    product_url character varying(255),
    show_banner boolean,
    show_options boolean
);
 )   DROP TABLE public.asset_ab_alternatives;
       public            postgres    false            r           1259    44883    asset_ab_alternative_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.asset_ab_alternative_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.asset_ab_alternative_id_seq;
       public          postgres    false    371            ?           0    0    asset_ab_alternative_id_seq    SEQUENCE OWNED BY     \   ALTER SEQUENCE public.asset_ab_alternative_id_seq OWNED BY public.asset_ab_alternatives.id;
          public          postgres    false    370            ?            1259    33660    asset_complexity_types    TABLE     ?   CREATE TABLE public.asset_complexity_types (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 *   DROP TABLE public.asset_complexity_types;
       public            postgres    false            ?            1259    33658    asset_complexity_types_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.asset_complexity_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.asset_complexity_types_id_seq;
       public          postgres    false    233            ?           0    0    asset_complexity_types_id_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.asset_complexity_types_id_seq OWNED BY public.asset_complexity_types.id;
          public          postgres    false    232            M           1259    35687    asset_files    TABLE     ?  CREATE TABLE public.asset_files (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    asset_id integer NOT NULL,
    collection integer,
    delete boolean,
    filename character varying(255) NOT NULL,
    hash character varying(255) NOT NULL,
    "order" integer,
    size integer NOT NULL,
    type_id integer NOT NULL
);
    DROP TABLE public.asset_files;
       public            postgres    false            L           1259    35685    asset_files_id_seq    SEQUENCE     {   CREATE SEQUENCE public.asset_files_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.asset_files_id_seq;
       public          postgres    false    333            ?           0    0    asset_files_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.asset_files_id_seq OWNED BY public.asset_files.id;
          public          postgres    false    332            ?            1259    25450    asset_issue_types    TABLE       CREATE TABLE public.asset_issue_types (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    category_id integer NOT NULL,
    sort_weight integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 %   DROP TABLE public.asset_issue_types;
       public            postgres    false            ?            1259    25448    asset_issue_types_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.asset_issue_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.asset_issue_types_id_seq;
       public          postgres    false    225            ?           0    0    asset_issue_types_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.asset_issue_types_id_seq OWNED BY public.asset_issue_types.id;
          public          postgres    false    224            ?            1259    25466    asset_issues    TABLE     d  CREATE TABLE public.asset_issues (
    id integer NOT NULL,
    asset_id integer NOT NULL,
    issue_type_id integer NOT NULL,
    additional_details text,
    screenshot character varying(255),
    resolved boolean NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    author_user_id integer
);
     DROP TABLE public.asset_issues;
       public            postgres    false            ?            1259    25464    asset_issues_id_seq    SEQUENCE     |   CREATE SEQUENCE public.asset_issues_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.asset_issues_id_seq;
       public          postgres    false    227            ?           0    0    asset_issues_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.asset_issues_id_seq OWNED BY public.asset_issues.id;
          public          postgres    false    226            ?            1259    33872    asset_metric_types    TABLE     ?   CREATE TABLE public.asset_metric_types (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 &   DROP TABLE public.asset_metric_types;
       public            postgres    false            ?            1259    33870    asset_metric_types_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.asset_metric_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.asset_metric_types_id_seq;
       public          postgres    false    248            ?           0    0    asset_metric_types_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.asset_metric_types_id_seq OWNED BY public.asset_metric_types.id;
          public          postgres    false    247            ?            1259    33904    asset_metrics    TABLE     ?  CREATE TABLE public.asset_metrics (
    id integer NOT NULL,
    asset_uid character varying(255) NOT NULL,
    device_type_id integer,
    metric_type_id integer NOT NULL,
    session_uid character varying(255),
    url character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    customer_uid character varying(255),
    ip_address character varying(255),
    user_agent character varying(512),
    source character varying(255),
    camera_engagement integer,
    session_time_ms integer,
    viewer_session_uid character varying(255),
    notes character varying(255),
    ab_id integer
);
 !   DROP TABLE public.asset_metrics;
       public            postgres    false            ?            1259    33902    asset_metrics_id_seq    SEQUENCE     }   CREATE SEQUENCE public.asset_metrics_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.asset_metrics_id_seq;
       public          postgres    false    252            ?           0    0    asset_metrics_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.asset_metrics_id_seq OWNED BY public.asset_metrics.id;
          public          postgres    false    251            >           1259    35364    asset_renders    TABLE     ?   CREATE TABLE public.asset_renders (
    id integer NOT NULL,
    asset_id integer NOT NULL,
    filename character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 !   DROP TABLE public.asset_renders;
       public            postgres    false            =           1259    35362    asset_renders_id_seq    SEQUENCE     }   CREATE SEQUENCE public.asset_renders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.asset_renders_id_seq;
       public          postgres    false    318            ?           0    0    asset_renders_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.asset_renders_id_seq OWNED BY public.asset_renders.id;
          public          postgres    false    317            Q           1259    35787    asset_spin_sets    TABLE     7  CREATE TABLE public.asset_spin_sets (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    asset_id integer NOT NULL,
    angle integer NOT NULL,
    image_count integer DEFAULT 0 NOT NULL,
    resolution integer DEFAULT 0 NOT NULL
);
 #   DROP TABLE public.asset_spin_sets;
       public            postgres    false            P           1259    35785    asset_spin_sets_id_seq    SEQUENCE        CREATE SEQUENCE public.asset_spin_sets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.asset_spin_sets_id_seq;
       public          postgres    false    337            ?           0    0    asset_spin_sets_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.asset_spin_sets_id_seq OWNED BY public.asset_spin_sets.id;
          public          postgres    false    336            !           1259    34456 %   asset_submission_issue_category_types    TABLE     2  CREATE TABLE public.asset_submission_issue_category_types (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    label character varying(255) NOT NULL,
    sort_weight integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 9   DROP TABLE public.asset_submission_issue_category_types;
       public            postgres    false                        1259    34454 ,   asset_submission_issue_category_types_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.asset_submission_issue_category_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 C   DROP SEQUENCE public.asset_submission_issue_category_types_id_seq;
       public          postgres    false    289            ?           0    0 ,   asset_submission_issue_category_types_id_seq    SEQUENCE OWNED BY     }   ALTER SEQUENCE public.asset_submission_issue_category_types_id_seq OWNED BY public.asset_submission_issue_category_types.id;
          public          postgres    false    288            <           1259    35262    asset_submission_issue_hotspots    TABLE     A  CREATE TABLE public.asset_submission_issue_hotspots (
    id integer NOT NULL,
    asset_submission_issue_id integer NOT NULL,
    "position" character varying(255) NOT NULL,
    normal character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 3   DROP TABLE public.asset_submission_issue_hotspots;
       public            postgres    false            ;           1259    35260 &   asset_submission_issue_hotspots_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.asset_submission_issue_hotspots_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 =   DROP SEQUENCE public.asset_submission_issue_hotspots_id_seq;
       public          postgres    false    316            ?           0    0 &   asset_submission_issue_hotspots_id_seq    SEQUENCE OWNED BY     q   ALTER SEQUENCE public.asset_submission_issue_hotspots_id_seq OWNED BY public.asset_submission_issue_hotspots.id;
          public          postgres    false    315            8           1259    35176    asset_submission_issue_images    TABLE       CREATE TABLE public.asset_submission_issue_images (
    id integer NOT NULL,
    asset_submission_issue_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    filename character varying(255) NOT NULL
);
 1   DROP TABLE public.asset_submission_issue_images;
       public            postgres    false            7           1259    35174 $   asset_submission_issue_images_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.asset_submission_issue_images_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ;   DROP SEQUENCE public.asset_submission_issue_images_id_seq;
       public          postgres    false    312            ?           0    0 $   asset_submission_issue_images_id_seq    SEQUENCE OWNED BY     m   ALTER SEQUENCE public.asset_submission_issue_images_id_seq OWNED BY public.asset_submission_issue_images.id;
          public          postgres    false    311            #           1259    34475    asset_submission_issue_types    TABLE        CREATE TABLE public.asset_submission_issue_types (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    category_id integer NOT NULL,
    sort_weight integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 0   DROP TABLE public.asset_submission_issue_types;
       public            postgres    false            "           1259    34473 #   asset_submission_issue_types_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.asset_submission_issue_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 :   DROP SEQUENCE public.asset_submission_issue_types_id_seq;
       public          postgres    false    291            ?           0    0 #   asset_submission_issue_types_id_seq    SEQUENCE OWNED BY     k   ALTER SEQUENCE public.asset_submission_issue_types_id_seq OWNED BY public.asset_submission_issue_types.id;
          public          postgres    false    290            :           1259    35210    asset_submission_issues    TABLE     [  CREATE TABLE public.asset_submission_issues (
    id integer NOT NULL,
    asset_submission_id integer NOT NULL,
    author_user_id integer NOT NULL,
    issue_type_id integer NOT NULL,
    deleted boolean DEFAULT false,
    description text NOT NULL,
    image_category integer,
    image_id integer,
    image_x integer,
    image_y integer,
    resolved boolean DEFAULT false NOT NULL,
    resolution_time timestamp with time zone,
    response text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    author_role_id integer DEFAULT 4 NOT NULL
);
 +   DROP TABLE public.asset_submission_issues;
       public            postgres    false            9           1259    35208    asset_submission_issues_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.asset_submission_issues_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.asset_submission_issues_id_seq;
       public          postgres    false    314            ?           0    0    asset_submission_issues_id_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.asset_submission_issues_id_seq OWNED BY public.asset_submission_issues.id;
          public          postgres    false    313                       1259    34427    asset_submission_renders    TABLE       CREATE TABLE public.asset_submission_renders (
    id integer NOT NULL,
    asset_submission_id integer NOT NULL,
    filename character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 ,   DROP TABLE public.asset_submission_renders;
       public            postgres    false                       1259    34425    asset_submission_renders_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.asset_submission_renders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE public.asset_submission_renders_id_seq;
       public          postgres    false    287            ?           0    0    asset_submission_renders_id_seq    SEQUENCE OWNED BY     c   ALTER SEQUENCE public.asset_submission_renders_id_seq OWNED BY public.asset_submission_renders.id;
          public          postgres    false    286                       1259    34412    asset_submission_status_types    TABLE     ?   CREATE TABLE public.asset_submission_status_types (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    resubmission_allowed boolean,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 1   DROP TABLE public.asset_submission_status_types;
       public            postgres    false                       1259    34410 $   asset_submission_status_types_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.asset_submission_status_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ;   DROP SEQUENCE public.asset_submission_status_types_id_seq;
       public          postgres    false    285            ?           0    0 $   asset_submission_status_types_id_seq    SEQUENCE OWNED BY     m   ALTER SEQUENCE public.asset_submission_status_types_id_seq OWNED BY public.asset_submission_status_types.id;
          public          postgres    false    284                       1259    34342    asset_submission_textures    TABLE       CREATE TABLE public.asset_submission_textures (
    id integer NOT NULL,
    asset_submission_id integer NOT NULL,
    filename character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 -   DROP TABLE public.asset_submission_textures;
       public            postgres    false                       1259    34340     asset_submission_textures_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.asset_submission_textures_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 7   DROP SEQUENCE public.asset_submission_textures_id_seq;
       public          postgres    false    281            ?           0    0     asset_submission_textures_id_seq    SEQUENCE OWNED BY     e   ALTER SEQUENCE public.asset_submission_textures_id_seq OWNED BY public.asset_submission_textures.id;
          public          postgres    false    280                       1259    34272    asset_submissions    TABLE       CREATE TABLE public.asset_submissions (
    id integer NOT NULL,
    asset_id integer NOT NULL,
    submission_number integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    folder character varying(255),
    status_id integer,
    unit_type_id integer DEFAULT 1 NOT NULL,
    height double precision,
    width double precision,
    depth double precision,
    has_reached_client boolean DEFAULT false NOT NULL,
    triangle_count integer
);
 %   DROP TABLE public.asset_submissions;
       public            postgres    false                       1259    34270    asset_submissions_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.asset_submissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.asset_submissions_id_seq;
       public          postgres    false    279            ?           0    0    asset_submissions_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.asset_submissions_id_seq OWNED BY public.asset_submissions.id;
          public          postgres    false    278            ?            1259    16408 
   asset_tags    TABLE     ?   CREATE TABLE public.asset_tags (
    asset_id integer NOT NULL,
    tag_id integer NOT NULL,
    sort_weight integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
    DROP TABLE public.asset_tags;
       public            postgres    false            [           1259    36022    asset_textures    TABLE     o  CREATE TABLE public.asset_textures (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    asset_id integer NOT NULL,
    color character varying(255) NOT NULL,
    filename character varying(255) NOT NULL,
    file_extension_type_id integer NOT NULL,
    texture_type_id integer NOT NULL
);
 "   DROP TABLE public.asset_textures;
       public            postgres    false            Z           1259    36020    asset_textures_id_seq    SEQUENCE     ~   CREATE SEQUENCE public.asset_textures_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.asset_textures_id_seq;
       public          postgres    false    347            ?           0    0    asset_textures_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.asset_textures_id_seq OWNED BY public.asset_textures.id;
          public          postgres    false    346            ?            1259    25146    asset_upload_logs    TABLE       CREATE TABLE public.asset_upload_logs (
    id integer NOT NULL,
    asset_id integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    modeling_hours double precision,
    texturing_hours double precision
);
 %   DROP TABLE public.asset_upload_logs;
       public            postgres    false            ?            1259    25144    asset_upload_logs_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.asset_upload_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.asset_upload_logs_id_seq;
       public          postgres    false    217            ?           0    0    asset_upload_logs_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.asset_upload_logs_id_seq OWNED BY public.asset_upload_logs.id;
          public          postgres    false    216                       1259    34044    asset_xrids    TABLE       CREATE TABLE public.asset_xrids (
    id integer NOT NULL,
    asset_id integer NOT NULL,
    xrid character varying(255) NOT NULL,
    domain character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
    DROP TABLE public.asset_xrids;
       public            postgres    false                       1259    34042    asset_xrids_id_seq    SEQUENCE     {   CREATE SEQUENCE public.asset_xrids_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.asset_xrids_id_seq;
       public          postgres    false    260            ?           0    0    asset_xrids_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.asset_xrids_id_seq OWNED BY public.asset_xrids.id;
          public          postgres    false    259            ?            1259    16411    assets    TABLE     ?  CREATE TABLE public.assets (
    id integer NOT NULL,
    uid character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    rating double precision DEFAULT '0'::double precision,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    permissions_level integer DEFAULT 1 NOT NULL,
    delete boolean DEFAULT false,
    allow_download boolean DEFAULT true NOT NULL,
    complexity_id integer DEFAULT 2 NOT NULL,
    archived boolean,
    product_name character varying(255),
    product_url character varying(1024),
    hdr character varying(255) DEFAULT 'bw_lebombo'::character varying,
    camera_orbit character varying(32),
    camera_target character varying(32),
    published boolean DEFAULT false,
    publish_date timestamp with time zone,
    show_options boolean DEFAULT false,
    banner_button_text character varying(255) DEFAULT ''::character varying,
    product_price character varying(255) DEFAULT ''::character varying,
    product_subtitle character varying(255) DEFAULT ''::character varying,
    show_banner boolean DEFAULT false,
    probability_weight integer DEFAULT 1
);
    DROP TABLE public.assets;
       public            postgres    false            ?            1259    16508    assets_id_seq    SEQUENCE     v   CREATE SEQUENCE public.assets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.assets_id_seq;
       public          postgres    false    186            ?           0    0    assets_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.assets_id_seq OWNED BY public.assets.id;
          public          postgres    false    192            ?            1259    33693    assignment_artist_logs    TABLE       CREATE TABLE public.assignment_artist_logs (
    id integer NOT NULL,
    assignment_id integer NOT NULL,
    user_id integer NOT NULL,
    date_unassigned timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 *   DROP TABLE public.assignment_artist_logs;
       public            postgres    false            ?            1259    33691    assignment_artist_logs_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.assignment_artist_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.assignment_artist_logs_id_seq;
       public          postgres    false    237            ?           0    0    assignment_artist_logs_id_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.assignment_artist_logs_id_seq OWNED BY public.assignment_artist_logs.id;
          public          postgres    false    236            ?            1259    33854    assignment_materials    TABLE     ?   CREATE TABLE public.assignment_materials (
    assignment_id integer NOT NULL,
    material_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 (   DROP TABLE public.assignment_materials;
       public            postgres    false            ?            1259    25124    assignment_modeling_types    TABLE     ?   CREATE TABLE public.assignment_modeling_types (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 -   DROP TABLE public.assignment_modeling_types;
       public            postgres    false            ?            1259    25122     assignment_modeling_types_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.assignment_modeling_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 7   DROP SEQUENCE public.assignment_modeling_types_id_seq;
       public          postgres    false    215            ?           0    0     assignment_modeling_types_id_seq    SEQUENCE OWNED BY     e   ALTER SEQUENCE public.assignment_modeling_types_id_seq OWNED BY public.assignment_modeling_types.id;
          public          postgres    false    214            ?            1259    33550    assignment_payments    TABLE     ?   CREATE TABLE public.assignment_payments (
    id integer NOT NULL,
    assignment_id integer NOT NULL,
    payment_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 '   DROP TABLE public.assignment_payments;
       public            postgres    false            ?            1259    33548    assignment_payments_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.assignment_payments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.assignment_payments_id_seq;
       public          postgres    false    229            ?           0    0    assignment_payments_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.assignment_payments_id_seq OWNED BY public.assignment_payments.id;
          public          postgres    false    228            ?            1259    33668    assignment_priority_types    TABLE     ?   CREATE TABLE public.assignment_priority_types (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 -   DROP TABLE public.assignment_priority_types;
       public            postgres    false            ?            1259    33666     assignment_priority_types_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.assignment_priority_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 7   DROP SEQUENCE public.assignment_priority_types_id_seq;
       public          postgres    false    235            ?           0    0     assignment_priority_types_id_seq    SEQUENCE OWNED BY     e   ALTER SEQUENCE public.assignment_priority_types_id_seq OWNED BY public.assignment_priority_types.id;
          public          postgres    false    234                       1259    34264    assignment_rework_logs    TABLE     ?   CREATE TABLE public.assignment_rework_logs (
    id integer NOT NULL,
    assignment_id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 *   DROP TABLE public.assignment_rework_logs;
       public            postgres    false                       1259    34262    assignment_rework_logs_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.assignment_rework_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.assignment_rework_logs_id_seq;
       public          postgres    false    277            ?           0    0    assignment_rework_logs_id_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.assignment_rework_logs_id_seq OWNED BY public.assignment_rework_logs.id;
          public          postgres    false    276            ?            1259    24843    assignment_status_types    TABLE     ?   CREATE TABLE public.assignment_status_types (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 +   DROP TABLE public.assignment_status_types;
       public            postgres    false            ?            1259    24841    assignment_statuses_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.assignment_statuses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.assignment_statuses_id_seq;
       public          postgres    false    199            ?           0    0    assignment_statuses_id_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public.assignment_statuses_id_seq OWNED BY public.assignment_status_types.id;
          public          postgres    false    198            ?            1259    24851    assignments    TABLE       CREATE TABLE public.assignments (
    id integer NOT NULL,
    uid character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    status_id integer DEFAULT 1 NOT NULL,
    asset_id integer DEFAULT 0 NOT NULL,
    height double precision DEFAULT '0'::double precision,
    width double precision DEFAULT '0'::double precision,
    depth double precision DEFAULT '0'::double precision,
    artist_user_id integer DEFAULT 0,
    date_due timestamp with time zone,
    date_completed timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    date_submitted timestamp with time zone,
    price double precision DEFAULT 50,
    product_url character varying(255),
    notes character varying(1024),
    modeling_type_id integer DEFAULT 1 NOT NULL,
    priority_id integer DEFAULT 2 NOT NULL,
    client_id integer DEFAULT 1 NOT NULL,
    product_vertical_id integer,
    project_id integer,
    units_in_m boolean,
    blend_name character varying(255)
);
    DROP TABLE public.assignments;
       public            postgres    false            ?            1259    24849    assignments_id_seq    SEQUENCE     {   CREATE SEQUENCE public.assignments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.assignments_id_seq;
       public          postgres    false    201            ?           0    0    assignments_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.assignments_id_seq OWNED BY public.assignments.id;
          public          postgres    false    200            w           1259    45046    base_materials    TABLE     ?  CREATE TABLE public.base_materials (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    blend_name character varying(255) NOT NULL,
    diffuse_red_value integer DEFAULT 255 NOT NULL,
    diffuse_green_value integer DEFAULT 255 NOT NULL,
    diffuse_blue_value integer DEFAULT 255 NOT NULL,
    mapping_scale_value double precision DEFAULT '1'::double precision NOT NULL,
    metallic_value integer,
    name character varying(255) NOT NULL,
    normal_strength_value double precision DEFAULT '1'::double precision NOT NULL,
    roughness_value double precision DEFAULT '1'::double precision NOT NULL,
    uid character varying(255) NOT NULL
);
 "   DROP TABLE public.base_materials;
       public            postgres    false            v           1259    45044    base_materials_id_seq    SEQUENCE     ~   CREATE SEQUENCE public.base_materials_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.base_materials_id_seq;
       public          postgres    false    375            ?           0    0    base_materials_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.base_materials_id_seq OWNED BY public.base_materials.id;
          public          postgres    false    374                       1259    34396    blender_addons    TABLE       CREATE TABLE public.blender_addons (
    id integer NOT NULL,
    version character varying(255) NOT NULL,
    blender_version character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 "   DROP TABLE public.blender_addons;
       public            postgres    false                       1259    34394    blender_addons_id_seq    SEQUENCE     ~   CREATE SEQUENCE public.blender_addons_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.blender_addons_id_seq;
       public          postgres    false    283            ?           0    0    blender_addons_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.blender_addons_id_seq OWNED BY public.blender_addons.id;
          public          postgres    false    282            *           1259    34710    client_brands    TABLE       CREATE TABLE public.client_brands (
    id integer NOT NULL,
    client_id integer NOT NULL,
    deleted boolean NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 !   DROP TABLE public.client_brands;
       public            postgres    false            )           1259    34708    client_brands_id_seq    SEQUENCE     }   CREATE SEQUENCE public.client_brands_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.client_brands_id_seq;
       public          postgres    false    298            ?           0    0    client_brands_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.client_brands_id_seq OWNED BY public.client_brands.id;
          public          postgres    false    297            ,           1259    34735    client_classes    TABLE       CREATE TABLE public.client_classes (
    id integer NOT NULL,
    client_id integer NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 "   DROP TABLE public.client_classes;
       public            postgres    false            +           1259    34733    client_classes_id_seq    SEQUENCE     ~   CREATE SEQUENCE public.client_classes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.client_classes_id_seq;
       public          postgres    false    300            ?           0    0    client_classes_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.client_classes_id_seq OWNED BY public.client_classes.id;
          public          postgres    false    299            ?            1259    24921    clients    TABLE     ?   CREATE TABLE public.clients (
    id integer NOT NULL,
    uid character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
    DROP TABLE public.clients;
       public            postgres    false            ?            1259    24919    clients_id_seq    SEQUENCE     w   CREATE SEQUENCE public.clients_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.clients_id_seq;
       public          postgres    false    205            ?           0    0    clients_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.clients_id_seq OWNED BY public.clients.id;
          public          postgres    false    204            ?            1259    33896    device_types    TABLE     ?   CREATE TABLE public.device_types (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
     DROP TABLE public.device_types;
       public            postgres    false            ?            1259    33894    device_types_id_seq    SEQUENCE     |   CREATE SEQUENCE public.device_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.device_types_id_seq;
       public          postgres    false    250            ?           0    0    device_types_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.device_types_id_seq OWNED BY public.device_types.id;
          public          postgres    false    249            e           1259    36266 
   email_logs    TABLE       CREATE TABLE public.email_logs (
    id integer NOT NULL,
    email_to character varying(255) NOT NULL,
    subject character varying(255) NOT NULL,
    html text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
    DROP TABLE public.email_logs;
       public            postgres    false            d           1259    36264    email_logs_id_seq    SEQUENCE     z   CREATE SEQUENCE public.email_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.email_logs_id_seq;
       public          postgres    false    357            ?           0    0    email_logs_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.email_logs_id_seq OWNED BY public.email_logs.id;
          public          postgres    false    356            ?            1259    16421    errors    TABLE     ?   CREATE TABLE public.errors (
    id integer NOT NULL,
    hash character varying(255) NOT NULL,
    message character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
    DROP TABLE public.errors;
       public            postgres    false                       1259    34119    faqs    TABLE     k  CREATE TABLE public.faqs (
    id integer NOT NULL,
    title character varying(255),
    question text,
    answer text,
    asked_by_user_id integer NOT NULL,
    answered_by_user_id integer,
    answered boolean,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    public boolean,
    sort_weight integer
);
    DROP TABLE public.faqs;
       public            postgres    false                       1259    34117    faqs_id_seq    SEQUENCE     t   CREATE SEQUENCE public.faqs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.faqs_id_seq;
       public          postgres    false    263            ?           0    0    faqs_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.faqs_id_seq OWNED BY public.faqs.id;
          public          postgres    false    262            ]           1259    36033    file_extension_types    TABLE     ?   CREATE TABLE public.file_extension_types (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    name character varying(255) NOT NULL
);
 (   DROP TABLE public.file_extension_types;
       public            postgres    false            \           1259    36031    file_extension_types_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.file_extension_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.file_extension_types_id_seq;
       public          postgres    false    349            ?           0    0    file_extension_types_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.file_extension_types_id_seq OWNED BY public.file_extension_types.id;
          public          postgres    false    348            O           1259    35698 
   file_types    TABLE     ?   CREATE TABLE public.file_types (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    name character varying(255) NOT NULL
);
    DROP TABLE public.file_types;
       public            postgres    false            N           1259    35696    file_types_id_seq    SEQUENCE     z   CREATE SEQUENCE public.file_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.file_types_id_seq;
       public          postgres    false    335            ?           0    0    file_types_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.file_types_id_seq OWNED BY public.file_types.id;
          public          postgres    false    334                       1259    34179    help_chapter_sections    TABLE     C  CREATE TABLE public.help_chapter_sections (
    id integer NOT NULL,
    title character varying(255),
    content text,
    latest_user_id integer NOT NULL,
    help_chapter_id integer NOT NULL,
    sort_weight integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 )   DROP TABLE public.help_chapter_sections;
       public            postgres    false                       1259    34177    help_chapter_sections_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.help_chapter_sections_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.help_chapter_sections_id_seq;
       public          postgres    false    275            ?           0    0    help_chapter_sections_id_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public.help_chapter_sections_id_seq OWNED BY public.help_chapter_sections.id;
          public          postgres    false    274                       1259    34168    help_chapters    TABLE     ?   CREATE TABLE public.help_chapters (
    id integer NOT NULL,
    title character varying(255),
    icon character varying(255),
    sort_weight integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 !   DROP TABLE public.help_chapters;
       public            postgres    false                       1259    34166    help_chapters_id_seq    SEQUENCE     }   CREATE SEQUENCE public.help_chapters_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.help_chapters_id_seq;
       public          postgres    false    273            ?           0    0    help_chapters_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.help_chapters_id_seq OWNED BY public.help_chapters.id;
          public          postgres    false    272                       1259    34157    help_sections    TABLE     6  CREATE TABLE public.help_sections (
    id integer NOT NULL,
    title character varying(255),
    content text,
    latest_user_id integer NOT NULL,
    sort_weight integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    icon character varying(255)
);
 !   DROP TABLE public.help_sections;
       public            postgres    false                       1259    34155    help_sections_id_seq    SEQUENCE     }   CREATE SEQUENCE public.help_sections_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.help_sections_id_seq;
       public          postgres    false    271            ?           0    0    help_sections_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.help_sections_id_seq OWNED BY public.help_sections.id;
          public          postgres    false    270            ?            1259    25030    icons    TABLE     ?   CREATE TABLE public.icons (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    noun_project_id integer
);
    DROP TABLE public.icons;
       public            postgres    false            ?            1259    25028    icons_id_seq    SEQUENCE     u   CREATE SEQUENCE public.icons_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.icons_id_seq;
       public          postgres    false    211            ?           0    0    icons_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.icons_id_seq OWNED BY public.icons.id;
          public          postgres    false    210            ?            1259    25022    ip_logs    TABLE     ?   CREATE TABLE public.ip_logs (
    id integer NOT NULL,
    ip character varying(255) NOT NULL,
    user_id integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
    DROP TABLE public.ip_logs;
       public            postgres    false            ?            1259    25020    ip_logs_id_seq    SEQUENCE     w   CREATE SEQUENCE public.ip_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.ip_logs_id_seq;
       public          postgres    false    209            ?           0    0    ip_logs_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.ip_logs_id_seq OWNED BY public.ip_logs.id;
          public          postgres    false    208            U           1259    35869    job_comment_types    TABLE     ?   CREATE TABLE public.job_comment_types (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    name character varying(255) NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 %   DROP TABLE public.job_comment_types;
       public            postgres    false            T           1259    35867    job_comment_types_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.job_comment_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.job_comment_types_id_seq;
       public          postgres    false    341            ?           0    0    job_comment_types_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.job_comment_types_id_seq OWNED BY public.job_comment_types.id;
          public          postgres    false    340            S           1259    35860    job_comments    TABLE     h  CREATE TABLE public.job_comments (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    job_comment_type integer NOT NULL,
    parent_comment_id integer,
    user_id integer NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    content text,
    job_uid character varying(255)
);
     DROP TABLE public.job_comments;
       public            postgres    false            R           1259    35858    job_comments_id_seq    SEQUENCE     |   CREATE SEQUENCE public.job_comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.job_comments_id_seq;
       public          postgres    false    339            ?           0    0    job_comments_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.job_comments_id_seq OWNED BY public.job_comments.id;
          public          postgres    false    338            B           1259    35496    job_deadline_snapshots    TABLE       CREATE TABLE public.job_deadline_snapshots (
    id integer NOT NULL,
    date character varying(255) NOT NULL,
    job_count integer NOT NULL,
    type_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 *   DROP TABLE public.job_deadline_snapshots;
       public            postgres    false            A           1259    35494    job_deadline_snapshots_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.job_deadline_snapshots_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.job_deadline_snapshots_id_seq;
       public          postgres    false    322            ?           0    0    job_deadline_snapshots_id_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.job_deadline_snapshots_id_seq OWNED BY public.job_deadline_snapshots.id;
          public          postgres    false    321            D           1259    35521    job_deadline_types    TABLE     ?   CREATE TABLE public.job_deadline_types (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 &   DROP TABLE public.job_deadline_types;
       public            postgres    false            C           1259    35519    job_deadline_types_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.job_deadline_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.job_deadline_types_id_seq;
       public          postgres    false    324            ?           0    0    job_deadline_types_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.job_deadline_types_id_seq OWNED BY public.job_deadline_types.id;
          public          postgres    false    323            2           1259    34766    job_priority_types    TABLE     ?   CREATE TABLE public.job_priority_types (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 &   DROP TABLE public.job_priority_types;
       public            postgres    false            1           1259    34764    job_priority_types_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.job_priority_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.job_priority_types_id_seq;
       public          postgres    false    306            ?           0    0    job_priority_types_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.job_priority_types_id_seq OWNED BY public.job_priority_types.id;
          public          postgres    false    305            .           1259    34750    job_quality_types    TABLE     ?   CREATE TABLE public.job_quality_types (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 %   DROP TABLE public.job_quality_types;
       public            postgres    false            -           1259    34748    job_quality_types_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.job_quality_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.job_quality_types_id_seq;
       public          postgres    false    302            ?           0    0    job_quality_types_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.job_quality_types_id_seq OWNED BY public.job_quality_types.id;
          public          postgres    false    301            6           1259    34895    job_status_logs    TABLE     ?   CREATE TABLE public.job_status_logs (
    id integer NOT NULL,
    job_id integer NOT NULL,
    status_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 #   DROP TABLE public.job_status_logs;
       public            postgres    false            5           1259    34893    job_status_logs_id_seq    SEQUENCE        CREATE SEQUENCE public.job_status_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.job_status_logs_id_seq;
       public          postgres    false    310            ?           0    0    job_status_logs_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.job_status_logs_id_seq OWNED BY public.job_status_logs.id;
          public          postgres    false    309            @           1259    35456    job_status_snapshots    TABLE       CREATE TABLE public.job_status_snapshots (
    id integer NOT NULL,
    date character varying(255) NOT NULL,
    job_count integer NOT NULL,
    job_status_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 (   DROP TABLE public.job_status_snapshots;
       public            postgres    false            ?           1259    35454    job_status_snapshots_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.job_status_snapshots_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.job_status_snapshots_id_seq;
       public          postgres    false    320            ?           0    0    job_status_snapshots_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.job_status_snapshots_id_seq OWNED BY public.job_status_snapshots.id;
          public          postgres    false    319            0           1259    34758    job_status_types    TABLE     ?   CREATE TABLE public.job_status_types (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 $   DROP TABLE public.job_status_types;
       public            postgres    false            /           1259    34756    job_status_types_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.job_status_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.job_status_types_id_seq;
       public          postgres    false    304            ?           0    0    job_status_types_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.job_status_types_id_seq OWNED BY public.job_status_types.id;
          public          postgres    false    303                        1259    33971    jobs    TABLE     :  CREATE TABLE public.jobs (
    id integer NOT NULL,
    uid character varying(255) NOT NULL,
    product_id integer NOT NULL,
    status_id integer DEFAULT 1 NOT NULL,
    price double precision DEFAULT '50'::double precision,
    date_due timestamp with time zone,
    date_submitted timestamp with time zone,
    date_completed timestamp with time zone,
    notes text,
    priority_id integer DEFAULT 2 NOT NULL,
    client_id integer DEFAULT 1 NOT NULL,
    project_id integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    quality_id integer DEFAULT 1,
    brand_id integer,
    class_id integer,
    additional_dimensions text,
    material_information text,
    modeling_instructions text,
    deleted boolean,
    completed_via_script boolean DEFAULT false
);
    DROP TABLE public.jobs;
       public            postgres    false            ?            1259    33969    jobs_id_seq    SEQUENCE     t   CREATE SEQUENCE public.jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.jobs_id_seq;
       public          postgres    false    256            ?           0    0    jobs_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;
          public          postgres    false    255            %           1259    34508    login_tokens    TABLE     0  CREATE TABLE public.login_tokens (
    id integer NOT NULL,
    user_id integer NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    ip character varying(63),
    user_agent character varying(255)
);
     DROP TABLE public.login_tokens;
       public            postgres    false            $           1259    34506    login_tokens_id_seq    SEQUENCE     |   CREATE SEQUENCE public.login_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.login_tokens_id_seq;
       public          postgres    false    293            ?           0    0    login_tokens_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.login_tokens_id_seq OWNED BY public.login_tokens.id;
          public          postgres    false    292            ?            1259    16496    mailing_lists    TABLE     |  CREATE TABLE public.mailing_lists (
    id integer NOT NULL,
    name character varying(255),
    email character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    ip character varying,
    phone character varying(32),
    company character varying(255),
    message text,
    interest character varying(255)
);
 !   DROP TABLE public.mailing_lists;
       public            postgres    false            ?            1259    16494    mailing_lists_id_seq    SEQUENCE     }   CREATE SEQUENCE public.mailing_lists_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.mailing_lists_id_seq;
       public          postgres    false    191            ?           0    0    mailing_lists_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.mailing_lists_id_seq OWNED BY public.mailing_lists.id;
          public          postgres    false    190            ?            1259    33759 	   materials    TABLE     ?  CREATE TABLE public.materials (
    id integer NOT NULL,
    uid character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    diffuse_red_value double precision,
    diffuse_green_value double precision,
    diffuse_blue_value double precision,
    metallic_value double precision,
    roughness_value double precision,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    blend_name character varying(255),
    mapping_scale_value double precision DEFAULT '1'::double precision NOT NULL,
    normal_strength_value double precision DEFAULT '1'::double precision NOT NULL,
    base_material_id integer,
    delete boolean DEFAULT false
);
    DROP TABLE public.materials;
       public            postgres    false            ?            1259    33757    materials_id_seq    SEQUENCE     y   CREATE SEQUENCE public.materials_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.materials_id_seq;
       public          postgres    false    243            ?           0    0    materials_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.materials_id_seq OWNED BY public.materials.id;
          public          postgres    false    242            I           1259    35655    notification_read_status_types    TABLE     z   CREATE TABLE public.notification_read_status_types (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);
 2   DROP TABLE public.notification_read_status_types;
       public            postgres    false            H           1259    35653 %   notification_read_status_types_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.notification_read_status_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 <   DROP SEQUENCE public.notification_read_status_types_id_seq;
       public          postgres    false    329            ?           0    0 %   notification_read_status_types_id_seq    SEQUENCE OWNED BY     o   ALTER SEQUENCE public.notification_read_status_types_id_seq OWNED BY public.notification_read_status_types.id;
          public          postgres    false    328            K           1259    35663    notification_types    TABLE     n   CREATE TABLE public.notification_types (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);
 &   DROP TABLE public.notification_types;
       public            postgres    false            J           1259    35661    notification_types_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.notification_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.notification_types_id_seq;
       public          postgres    false    331            ?           0    0    notification_types_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.notification_types_id_seq OWNED BY public.notification_types.id;
          public          postgres    false    330            G           1259    35645    notifications    TABLE     ?  CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id integer DEFAULT 0 NOT NULL,
    read_status_id integer DEFAULT 1 NOT NULL,
    notification_type_id integer,
    product_id integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    client_id integer,
    job_comment_id integer,
    job_id integer,
    project_id integer,
    ref_user_id integer,
    project_progress integer,
    deleted boolean DEFAULT false
);
 !   DROP TABLE public.notifications;
       public            postgres    false            F           1259    35643    notifications_id_seq    SEQUENCE     }   CREATE SEQUENCE public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.notifications_id_seq;
       public          postgres    false    327            ?           0    0    notifications_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;
          public          postgres    false    326            i           1259    44254    oauth_authorization_codes    TABLE       CREATE TABLE public.oauth_authorization_codes (
    id integer NOT NULL,
    user_id integer NOT NULL,
    oauth_client_id text NOT NULL,
    authorization_code text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 -   DROP TABLE public.oauth_authorization_codes;
       public            postgres    false            h           1259    44252     oauth_authorization_codes_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.oauth_authorization_codes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 7   DROP SEQUENCE public.oauth_authorization_codes_id_seq;
       public          postgres    false    361            ?           0    0     oauth_authorization_codes_id_seq    SEQUENCE OWNED BY     e   ALTER SEQUENCE public.oauth_authorization_codes_id_seq OWNED BY public.oauth_authorization_codes.id;
          public          postgres    false    360            g           1259    44243    oauth_clients    TABLE     ?   CREATE TABLE public.oauth_clients (
    id integer NOT NULL,
    client_id text NOT NULL,
    client_secret text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 !   DROP TABLE public.oauth_clients;
       public            postgres    false            f           1259    44241    oauth_clients_id_seq    SEQUENCE     }   CREATE SEQUENCE public.oauth_clients_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.oauth_clients_id_seq;
       public          postgres    false    359            ?           0    0    oauth_clients_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.oauth_clients_id_seq OWNED BY public.oauth_clients.id;
          public          postgres    false    358            ?            1259    33597    payments    TABLE     ?  CREATE TABLE public.payments (
    id integer NOT NULL,
    uid character varying(255) NOT NULL,
    admin_user_id integer NOT NULL,
    artist_user_id integer NOT NULL,
    paypal_email character varying(255) NOT NULL,
    paypal_transaction_id character varying(255) NOT NULL,
    transaction_amount double precision NOT NULL,
    transaction_date timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
    DROP TABLE public.payments;
       public            postgres    false            ?            1259    33595    payments_id_seq    SEQUENCE     x   CREATE SEQUENCE public.payments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.payments_id_seq;
       public          postgres    false    231            ?           0    0    payments_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;
          public          postgres    false    230            ?            1259    24998    permissions_levels    TABLE     ?   CREATE TABLE public.permissions_levels (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 &   DROP TABLE public.permissions_levels;
       public            postgres    false            ?            1259    24996    permissions_levels_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.permissions_levels_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.permissions_levels_id_seq;
       public          postgres    false    207            ?           0    0    permissions_levels_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.permissions_levels_id_seq OWNED BY public.permissions_levels.id;
          public          postgres    false    206            4           1259    34867    product_additional_files    TABLE       CREATE TABLE public.product_additional_files (
    id integer NOT NULL,
    filename character varying(255) NOT NULL,
    product_id integer NOT NULL,
    sort_weight integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 ,   DROP TABLE public.product_additional_files;
       public            postgres    false            3           1259    34865    product_additional_files_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.product_additional_files_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE public.product_additional_files_id_seq;
       public          postgres    false    308            ?           0    0    product_additional_files_id_seq    SEQUENCE OWNED BY     c   ALTER SEQUENCE public.product_additional_files_id_seq OWNED BY public.product_additional_files.id;
          public          postgres    false    307            Y           1259    36014    product_combinations    TABLE     ?   CREATE TABLE public.product_combinations (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    asset_id integer NOT NULL,
    product_id integer NOT NULL
);
 (   DROP TABLE public.product_combinations;
       public            postgres    false            X           1259    36012    product_combinations_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.product_combinations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.product_combinations_id_seq;
       public          postgres    false    345            ?           0    0    product_combinations_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.product_combinations_id_seq OWNED BY public.product_combinations.id;
          public          postgres    false    344            u           1259    45029    product_favorites    TABLE     ?   CREATE TABLE public.product_favorites (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    product_id integer NOT NULL,
    user_id integer NOT NULL
);
 %   DROP TABLE public.product_favorites;
       public            postgres    false            t           1259    45027    product_favorites_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.product_favorites_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.product_favorites_id_seq;
       public          postgres    false    373            ?           0    0    product_favorites_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.product_favorites_id_seq OWNED BY public.product_favorites.id;
          public          postgres    false    372            o           1259    44819     product_holding_reference_images    TABLE       CREATE TABLE public.product_holding_reference_images (
    id integer NOT NULL,
    bc_product_id integer,
    bc_product_reference_image_id integer,
    deleted boolean DEFAULT false,
    filename character varying(255) NOT NULL,
    image_large_url character varying(255) NOT NULL,
    image_small_url character varying(255) NOT NULL,
    product_holding_id integer NOT NULL,
    sort_weight integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 4   DROP TABLE public.product_holding_reference_images;
       public            postgres    false            n           1259    44817 '   product_holding_reference_images_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.product_holding_reference_images_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 >   DROP SEQUENCE public.product_holding_reference_images_id_seq;
       public          postgres    false    367            ?           0    0 '   product_holding_reference_images_id_seq    SEQUENCE OWNED BY     s   ALTER SEQUENCE public.product_holding_reference_images_id_seq OWNED BY public.product_holding_reference_images.id;
          public          postgres    false    366            q           1259    44831    product_holding_types    TABLE     q   CREATE TABLE public.product_holding_types (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);
 )   DROP TABLE public.product_holding_types;
       public            postgres    false            p           1259    44829    product_holding_types_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.product_holding_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.product_holding_types_id_seq;
       public          postgres    false    369            ?           0    0    product_holding_types_id_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public.product_holding_types_id_seq OWNED BY public.product_holding_types.id;
          public          postgres    false    368            m           1259    44804    product_holdings    TABLE     ?  CREATE TABLE public.product_holdings (
    id integer NOT NULL,
    bc_product_id integer NOT NULL,
    client_id integer NOT NULL,
    product_holding integer,
    project_holding_id integer,
    product_holding_type integer NOT NULL,
    depth double precision DEFAULT '0'::double precision,
    height double precision DEFAULT '0'::double precision,
    name text,
    description text,
    part_number character varying(255),
    sku character varying(255),
    unit_type_id integer,
    width double precision DEFAULT '0'::double precision,
    deleted boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 $   DROP TABLE public.product_holdings;
       public            postgres    false            l           1259    44802    product_holdings_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.product_holdings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.product_holdings_id_seq;
       public          postgres    false    365            ?           0    0    product_holdings_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.product_holdings_id_seq OWNED BY public.product_holdings.id;
          public          postgres    false    364                       1259    34057    product_materials    TABLE     ?   CREATE TABLE public.product_materials (
    product_id integer NOT NULL,
    material_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 %   DROP TABLE public.product_materials;
       public            postgres    false                       1259    34149    product_reference_images    TABLE     |  CREATE TABLE public.product_reference_images (
    id integer NOT NULL,
    product_id integer NOT NULL,
    filename character varying(255),
    sort_weight integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    "primary" boolean,
    fallback_image_url character varying(255) DEFAULT NULL::character varying
);
 ,   DROP TABLE public.product_reference_images;
       public            postgres    false                       1259    34147    product_reference_images_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.product_reference_images_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE public.product_reference_images_id_seq;
       public          postgres    false    269            ?           0    0    product_reference_images_id_seq    SEQUENCE OWNED BY     c   ALTER SEQUENCE public.product_reference_images_id_seq OWNED BY public.product_reference_images.id;
          public          postgres    false    268            ?            1259    33729    product_verticals    TABLE     ?   CREATE TABLE public.product_verticals (
    id integer NOT NULL,
    uid character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 %   DROP TABLE public.product_verticals;
       public            postgres    false            ?            1259    33727    product_verticals_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.product_verticals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.product_verticals_id_seq;
       public          postgres    false    241            ?           0    0    product_verticals_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.product_verticals_id_seq OWNED BY public.product_verticals.id;
          public          postgres    false    240            ?            1259    33953    products    TABLE     &  CREATE TABLE public.products (
    id integer NOT NULL,
    uid character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    blend_name character varying(255),
    artist_user_id integer DEFAULT 0,
    height double precision DEFAULT '0'::double precision,
    width double precision DEFAULT '0'::double precision,
    depth double precision DEFAULT '0'::double precision,
    url text,
    modeling_type_id integer DEFAULT 1 NOT NULL,
    vertical_id integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    unit_type_id integer DEFAULT 1,
    asset_id integer,
    part_number character varying(255),
    asin character varying(255),
    deleted boolean DEFAULT false,
    bc_product_id integer,
    is_reviewed_import boolean
);
    DROP TABLE public.products;
       public            postgres    false            ?            1259    33951    products_id_seq    SEQUENCE     x   CREATE SEQUENCE public.products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.products_id_seq;
       public          postgres    false    254            ?           0    0    products_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;
          public          postgres    false    253            k           1259    44795    project_holdings    TABLE     D  CREATE TABLE public.project_holdings (
    id integer NOT NULL,
    client_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    name character varying(255) NOT NULL,
    default_unit_type integer NOT NULL,
    deleted boolean DEFAULT false NOT NULL
);
 $   DROP TABLE public.project_holdings;
       public            postgres    false            j           1259    44793    project_holdings_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.project_holdings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.project_holdings_id_seq;
       public          postgres    false    363            ?           0    0    project_holdings_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.project_holdings_id_seq OWNED BY public.project_holdings.id;
          public          postgres    false    362            (           1259    34603    project_status_types    TABLE     ?   CREATE TABLE public.project_status_types (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 (   DROP TABLE public.project_status_types;
       public            postgres    false            '           1259    34601    project_status_types_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.project_status_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.project_status_types_id_seq;
       public          postgres    false    296            ?           0    0    project_status_types_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.project_status_types_id_seq OWNED BY public.project_status_types.id;
          public          postgres    false    295            ?            1259    33809    projects    TABLE     ?  CREATE TABLE public.projects (
    id integer NOT NULL,
    uid character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    client_id integer DEFAULT 0 NOT NULL,
    status_id integer DEFAULT 1 NOT NULL,
    date_due timestamp with time zone,
    date_completed timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    default_brand integer,
    default_class integer,
    default_unit_type integer,
    default_quality integer DEFAULT 1,
    default_priority integer DEFAULT 1,
    default_artist_id integer,
    notification_status_id integer,
    deleted boolean DEFAULT false
);
    DROP TABLE public.projects;
       public            postgres    false            ?            1259    33807    projects_id_seq    SEQUENCE     x   CREATE SEQUENCE public.projects_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.projects_id_seq;
       public          postgres    false    245            ?           0    0    projects_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;
          public          postgres    false    244                       1259    34139 "   rabbit_message_action_status_texts    TABLE     "  CREATE TABLE public.rabbit_message_action_status_texts (
    id integer NOT NULL,
    action_id integer NOT NULL,
    status_id integer NOT NULL,
    text character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 6   DROP TABLE public.rabbit_message_action_status_texts;
       public            postgres    false            
           1259    34137 )   rabbit_message_action_status_texts_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.rabbit_message_action_status_texts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 @   DROP SEQUENCE public.rabbit_message_action_status_texts_id_seq;
       public          postgres    false    267            ?           0    0 )   rabbit_message_action_status_texts_id_seq    SEQUENCE OWNED BY     w   ALTER SEQUENCE public.rabbit_message_action_status_texts_id_seq OWNED BY public.rabbit_message_action_status_texts.id;
          public          postgres    false    266            	           1259    34131    rabbit_message_action_types    TABLE     ?   CREATE TABLE public.rabbit_message_action_types (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 /   DROP TABLE public.rabbit_message_action_types;
       public            postgres    false                       1259    34129 "   rabbit_message_action_types_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.rabbit_message_action_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE public.rabbit_message_action_types_id_seq;
       public          postgres    false    265            ?           0    0 "   rabbit_message_action_types_id_seq    SEQUENCE OWNED BY     i   ALTER SEQUENCE public.rabbit_message_action_types_id_seq OWNED BY public.rabbit_message_action_types.id;
          public          postgres    false    264            ?            1259    25195    rabbit_message_status_types    TABLE     ?   CREATE TABLE public.rabbit_message_status_types (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 /   DROP TABLE public.rabbit_message_status_types;
       public            postgres    false            ?            1259    25193 "   rabbit_message_status_types_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.rabbit_message_status_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE public.rabbit_message_status_types_id_seq;
       public          postgres    false    221            ?           0    0 "   rabbit_message_status_types_id_seq    SEQUENCE OWNED BY     i   ALTER SEQUENCE public.rabbit_message_status_types_id_seq OWNED BY public.rabbit_message_status_types.id;
          public          postgres    false    220            ?            1259    25219    rabbit_messages    TABLE     r  CREATE TABLE public.rabbit_messages (
    id integer NOT NULL,
    action_id integer NOT NULL,
    status_id integer NOT NULL,
    user_id integer NOT NULL,
    data text NOT NULL,
    error_message text,
    delete boolean NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    queue character varying(255)
);
 #   DROP TABLE public.rabbit_messages;
       public            postgres    false            ?            1259    25217    rabbit_messages_id_seq    SEQUENCE        CREATE SEQUENCE public.rabbit_messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.rabbit_messages_id_seq;
       public          postgres    false    223            ?           0    0    rabbit_messages_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.rabbit_messages_id_seq OWNED BY public.rabbit_messages.id;
          public          postgres    false    222            ?            1259    25161    rework_messages    TABLE     ?   CREATE TABLE public.rework_messages (
    id integer NOT NULL,
    assignment_id integer,
    user_id integer,
    message text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 #   DROP TABLE public.rework_messages;
       public            postgres    false            ?            1259    25159    rework_messages_id_seq    SEQUENCE        CREATE SEQUENCE public.rework_messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.rework_messages_id_seq;
       public          postgres    false    219            ?           0    0    rework_messages_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.rework_messages_id_seq OWNED BY public.rework_messages.id;
          public          postgres    false    218            ?            1259    16530    roles    TABLE     ?   CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
    DROP TABLE public.roles;
       public            postgres    false            ?            1259    16528    roles_id_seq    SEQUENCE     u   CREATE SEQUENCE public.roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.roles_id_seq;
       public          postgres    false    196            ?           0    0    roles_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;
          public          postgres    false    195            ?            1259    24886    source_data_types    TABLE     ?   CREATE TABLE public.source_data_types (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 %   DROP TABLE public.source_data_types;
       public            postgres    false            ?            1259    24884    source_data_types_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.source_data_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.source_data_types_id_seq;
       public          postgres    false    203                        0    0    source_data_types_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.source_data_types_id_seq OWNED BY public.source_data_types.id;
          public          postgres    false    202            ?            1259    16418    tags    TABLE     %  CREATE TABLE public.tags (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    permissions_level_id integer DEFAULT 1 NOT NULL,
    sort_weight integer DEFAULT 1 NOT NULL
);
    DROP TABLE public.tags;
       public            postgres    false            ?            1259    16511    tags_id_seq    SEQUENCE     t   CREATE SEQUENCE public.tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.tags_id_seq;
       public          postgres    false    187                       0    0    tags_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;
          public          postgres    false    193            W           1259    36006    texture_types    TABLE     ?   CREATE TABLE public.texture_types (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    name character varying(255) NOT NULL
);
 !   DROP TABLE public.texture_types;
       public            postgres    false            V           1259    36004    texture_types_id_seq    SEQUENCE     }   CREATE SEQUENCE public.texture_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.texture_types_id_seq;
       public          postgres    false    343                       0    0    texture_types_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.texture_types_id_seq OWNED BY public.texture_types.id;
          public          postgres    false    342                       1259    34017 
   unit_types    TABLE     ?   CREATE TABLE public.unit_types (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
    DROP TABLE public.unit_types;
       public            postgres    false                       1259    34015    unit_types_id_seq    SEQUENCE     z   CREATE SEQUENCE public.unit_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.unit_types_id_seq;
       public          postgres    false    258                       0    0    unit_types_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.unit_types_id_seq OWNED BY public.unit_types.id;
          public          postgres    false    257            c           1259    36257    user_agreement_responses    TABLE     !  CREATE TABLE public.user_agreement_responses (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    user_agreement_id integer NOT NULL,
    user_id integer NOT NULL,
    response boolean DEFAULT false NOT NULL
);
 ,   DROP TABLE public.user_agreement_responses;
       public            postgres    false            b           1259    36255    user_agreement_responses_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.user_agreement_responses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE public.user_agreement_responses_id_seq;
       public          postgres    false    355                       0    0    user_agreement_responses_id_seq    SEQUENCE OWNED BY     c   ALTER SEQUENCE public.user_agreement_responses_id_seq OWNED BY public.user_agreement_responses.id;
          public          postgres    false    354            _           1259    36241    user_agreement_types    TABLE     p   CREATE TABLE public.user_agreement_types (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);
 (   DROP TABLE public.user_agreement_types;
       public            postgres    false            ^           1259    36239    user_agreement_types_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.user_agreement_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.user_agreement_types_id_seq;
       public          postgres    false    351                       0    0    user_agreement_types_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.user_agreement_types_id_seq OWNED BY public.user_agreement_types.id;
          public          postgres    false    350            a           1259    36249    user_agreements    TABLE     ?   CREATE TABLE public.user_agreements (
    id integer NOT NULL,
    user_agreement_type_id integer NOT NULL,
    version integer NOT NULL
);
 #   DROP TABLE public.user_agreements;
       public            postgres    false            `           1259    36247    user_agreements_id_seq    SEQUENCE        CREATE SEQUENCE public.user_agreements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.user_agreements_id_seq;
       public          postgres    false    353                       0    0    user_agreements_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.user_agreements_id_seq OWNED BY public.user_agreements.id;
          public          postgres    false    352            &           1259    34545    user_clients    TABLE     ?   CREATE TABLE public.user_clients (
    user_id integer NOT NULL,
    client_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
     DROP TABLE public.user_clients;
       public            postgres    false            ?            1259    16598 
   user_roles    TABLE     ?   CREATE TABLE public.user_roles (
    user_id integer NOT NULL,
    role_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
    DROP TABLE public.user_roles;
       public            postgres    false            ?            1259    16443    users    TABLE     ?  CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    hash character varying(255) NOT NULL,
    admin boolean DEFAULT false,
    first_name character varying(255),
    last_name character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    artist boolean DEFAULT false NOT NULL,
    paypal_email character varying(255),
    api_token character varying(255),
    reset_password_hash character varying(255),
    phone character varying(32),
    primary_role_id integer DEFAULT 1,
    email_notifications boolean DEFAULT true NOT NULL
);
    DROP TABLE public.users;
       public            postgres    false            ?            1259    16514    users_id_seq    SEQUENCE     u   CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    189                       0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    194            ?            1259    33701    web_crawler_queries    TABLE     ?  CREATE TABLE public.web_crawler_queries (
    id integer NOT NULL,
    search_term character varying(255) NOT NULL,
    user_id integer NOT NULL,
    count integer NOT NULL,
    complete boolean,
    archive boolean,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 '   DROP TABLE public.web_crawler_queries;
       public            postgres    false            ?            1259    33699    web_crawler_queries_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.web_crawler_queries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.web_crawler_queries_id_seq;
       public          postgres    false    239                       0    0    web_crawler_queries_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.web_crawler_queries_id_seq OWNED BY public.web_crawler_queries.id;
          public          postgres    false    238            ?            1259    25096    zip_logs    TABLE     ?   CREATE TABLE public.zip_logs (
    id integer NOT NULL,
    asset_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
    DROP TABLE public.zip_logs;
       public            postgres    false            ?            1259    25094    zip_logs_id_seq    SEQUENCE     x   CREATE SEQUENCE public.zip_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.zip_logs_id_seq;
       public          postgres    false    213            	           0    0    zip_logs_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.zip_logs_id_seq OWNED BY public.zip_logs.id;
          public          postgres    false    212            $           2604    44888    asset_ab_alternatives id    DEFAULT     ?   ALTER TABLE ONLY public.asset_ab_alternatives ALTER COLUMN id SET DEFAULT nextval('public.asset_ab_alternative_id_seq'::regclass);
 G   ALTER TABLE public.asset_ab_alternatives ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    370    371    371            ?           2604    33663    asset_complexity_types id    DEFAULT     ?   ALTER TABLE ONLY public.asset_complexity_types ALTER COLUMN id SET DEFAULT nextval('public.asset_complexity_types_id_seq'::regclass);
 H   ALTER TABLE public.asset_complexity_types ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    232    233    233                       2604    35690    asset_files id    DEFAULT     p   ALTER TABLE ONLY public.asset_files ALTER COLUMN id SET DEFAULT nextval('public.asset_files_id_seq'::regclass);
 =   ALTER TABLE public.asset_files ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    333    332    333            ?           2604    25453    asset_issue_types id    DEFAULT     |   ALTER TABLE ONLY public.asset_issue_types ALTER COLUMN id SET DEFAULT nextval('public.asset_issue_types_id_seq'::regclass);
 C   ALTER TABLE public.asset_issue_types ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    224    225    225            ?           2604    25469    asset_issues id    DEFAULT     r   ALTER TABLE ONLY public.asset_issues ALTER COLUMN id SET DEFAULT nextval('public.asset_issues_id_seq'::regclass);
 >   ALTER TABLE public.asset_issues ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    226    227    227            ?           2604    33875    asset_metric_types id    DEFAULT     ~   ALTER TABLE ONLY public.asset_metric_types ALTER COLUMN id SET DEFAULT nextval('public.asset_metric_types_id_seq'::regclass);
 D   ALTER TABLE public.asset_metric_types ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    248    247    248            ?           2604    33907    asset_metrics id    DEFAULT     t   ALTER TABLE ONLY public.asset_metrics ALTER COLUMN id SET DEFAULT nextval('public.asset_metrics_id_seq'::regclass);
 ?   ALTER TABLE public.asset_metrics ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    252    251    252            ?           2604    35367    asset_renders id    DEFAULT     t   ALTER TABLE ONLY public.asset_renders ALTER COLUMN id SET DEFAULT nextval('public.asset_renders_id_seq'::regclass);
 ?   ALTER TABLE public.asset_renders ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    317    318    318            	           2604    35790    asset_spin_sets id    DEFAULT     x   ALTER TABLE ONLY public.asset_spin_sets ALTER COLUMN id SET DEFAULT nextval('public.asset_spin_sets_id_seq'::regclass);
 A   ALTER TABLE public.asset_spin_sets ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    337    336    337            ?           2604    34459 (   asset_submission_issue_category_types id    DEFAULT     ?   ALTER TABLE ONLY public.asset_submission_issue_category_types ALTER COLUMN id SET DEFAULT nextval('public.asset_submission_issue_category_types_id_seq'::regclass);
 W   ALTER TABLE public.asset_submission_issue_category_types ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    289    288    289            ?           2604    35265 "   asset_submission_issue_hotspots id    DEFAULT     ?   ALTER TABLE ONLY public.asset_submission_issue_hotspots ALTER COLUMN id SET DEFAULT nextval('public.asset_submission_issue_hotspots_id_seq'::regclass);
 Q   ALTER TABLE public.asset_submission_issue_hotspots ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    315    316    316            ?           2604    35179     asset_submission_issue_images id    DEFAULT     ?   ALTER TABLE ONLY public.asset_submission_issue_images ALTER COLUMN id SET DEFAULT nextval('public.asset_submission_issue_images_id_seq'::regclass);
 O   ALTER TABLE public.asset_submission_issue_images ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    312    311    312            ?           2604    34478    asset_submission_issue_types id    DEFAULT     ?   ALTER TABLE ONLY public.asset_submission_issue_types ALTER COLUMN id SET DEFAULT nextval('public.asset_submission_issue_types_id_seq'::regclass);
 N   ALTER TABLE public.asset_submission_issue_types ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    290    291    291            ?           2604    35213    asset_submission_issues id    DEFAULT     ?   ALTER TABLE ONLY public.asset_submission_issues ALTER COLUMN id SET DEFAULT nextval('public.asset_submission_issues_id_seq'::regclass);
 I   ALTER TABLE public.asset_submission_issues ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    313    314    314            ?           2604    34430    asset_submission_renders id    DEFAULT     ?   ALTER TABLE ONLY public.asset_submission_renders ALTER COLUMN id SET DEFAULT nextval('public.asset_submission_renders_id_seq'::regclass);
 J   ALTER TABLE public.asset_submission_renders ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    286    287    287            ?           2604    34415     asset_submission_status_types id    DEFAULT     ?   ALTER TABLE ONLY public.asset_submission_status_types ALTER COLUMN id SET DEFAULT nextval('public.asset_submission_status_types_id_seq'::regclass);
 O   ALTER TABLE public.asset_submission_status_types ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    285    284    285            ?           2604    34345    asset_submission_textures id    DEFAULT     ?   ALTER TABLE ONLY public.asset_submission_textures ALTER COLUMN id SET DEFAULT nextval('public.asset_submission_textures_id_seq'::regclass);
 K   ALTER TABLE public.asset_submission_textures ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    280    281    281            ?           2604    34275    asset_submissions id    DEFAULT     |   ALTER TABLE ONLY public.asset_submissions ALTER COLUMN id SET DEFAULT nextval('public.asset_submissions_id_seq'::regclass);
 C   ALTER TABLE public.asset_submissions ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    278    279    279                       2604    36025    asset_textures id    DEFAULT     v   ALTER TABLE ONLY public.asset_textures ALTER COLUMN id SET DEFAULT nextval('public.asset_textures_id_seq'::regclass);
 @   ALTER TABLE public.asset_textures ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    347    346    347            ?           2604    25149    asset_upload_logs id    DEFAULT     |   ALTER TABLE ONLY public.asset_upload_logs ALTER COLUMN id SET DEFAULT nextval('public.asset_upload_logs_id_seq'::regclass);
 C   ALTER TABLE public.asset_upload_logs ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    217    217            ?           2604    34047    asset_xrids id    DEFAULT     p   ALTER TABLE ONLY public.asset_xrids ALTER COLUMN id SET DEFAULT nextval('public.asset_xrids_id_seq'::regclass);
 =   ALTER TABLE public.asset_xrids ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    259    260    260            ?           2604    16510 	   assets id    DEFAULT     f   ALTER TABLE ONLY public.assets ALTER COLUMN id SET DEFAULT nextval('public.assets_id_seq'::regclass);
 8   ALTER TABLE public.assets ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    192    186            ?           2604    33696    assignment_artist_logs id    DEFAULT     ?   ALTER TABLE ONLY public.assignment_artist_logs ALTER COLUMN id SET DEFAULT nextval('public.assignment_artist_logs_id_seq'::regclass);
 H   ALTER TABLE public.assignment_artist_logs ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    237    236    237            ?           2604    25127    assignment_modeling_types id    DEFAULT     ?   ALTER TABLE ONLY public.assignment_modeling_types ALTER COLUMN id SET DEFAULT nextval('public.assignment_modeling_types_id_seq'::regclass);
 K   ALTER TABLE public.assignment_modeling_types ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    214    215            ?           2604    33553    assignment_payments id    DEFAULT     ?   ALTER TABLE ONLY public.assignment_payments ALTER COLUMN id SET DEFAULT nextval('public.assignment_payments_id_seq'::regclass);
 E   ALTER TABLE public.assignment_payments ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    228    229    229            ?           2604    33671    assignment_priority_types id    DEFAULT     ?   ALTER TABLE ONLY public.assignment_priority_types ALTER COLUMN id SET DEFAULT nextval('public.assignment_priority_types_id_seq'::regclass);
 K   ALTER TABLE public.assignment_priority_types ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    235    234    235            ?           2604    34267    assignment_rework_logs id    DEFAULT     ?   ALTER TABLE ONLY public.assignment_rework_logs ALTER COLUMN id SET DEFAULT nextval('public.assignment_rework_logs_id_seq'::regclass);
 H   ALTER TABLE public.assignment_rework_logs ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    276    277    277            ?           2604    24846    assignment_status_types id    DEFAULT     ?   ALTER TABLE ONLY public.assignment_status_types ALTER COLUMN id SET DEFAULT nextval('public.assignment_statuses_id_seq'::regclass);
 I   ALTER TABLE public.assignment_status_types ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    198    199    199            ?           2604    24854    assignments id    DEFAULT     p   ALTER TABLE ONLY public.assignments ALTER COLUMN id SET DEFAULT nextval('public.assignments_id_seq'::regclass);
 =   ALTER TABLE public.assignments ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    200    201    201            '           2604    45049    base_materials id    DEFAULT     v   ALTER TABLE ONLY public.base_materials ALTER COLUMN id SET DEFAULT nextval('public.base_materials_id_seq'::regclass);
 @   ALTER TABLE public.base_materials ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    375    374    375            ?           2604    34399    blender_addons id    DEFAULT     v   ALTER TABLE ONLY public.blender_addons ALTER COLUMN id SET DEFAULT nextval('public.blender_addons_id_seq'::regclass);
 @   ALTER TABLE public.blender_addons ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    282    283    283            ?           2604    34713    client_brands id    DEFAULT     t   ALTER TABLE ONLY public.client_brands ALTER COLUMN id SET DEFAULT nextval('public.client_brands_id_seq'::regclass);
 ?   ALTER TABLE public.client_brands ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    297    298    298            ?           2604    34738    client_classes id    DEFAULT     v   ALTER TABLE ONLY public.client_classes ALTER COLUMN id SET DEFAULT nextval('public.client_classes_id_seq'::regclass);
 @   ALTER TABLE public.client_classes ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    299    300    300            ?           2604    24924 
   clients id    DEFAULT     h   ALTER TABLE ONLY public.clients ALTER COLUMN id SET DEFAULT nextval('public.clients_id_seq'::regclass);
 9   ALTER TABLE public.clients ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    204    205    205            ?           2604    33899    device_types id    DEFAULT     r   ALTER TABLE ONLY public.device_types ALTER COLUMN id SET DEFAULT nextval('public.device_types_id_seq'::regclass);
 >   ALTER TABLE public.device_types ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    250    249    250                       2604    36269    email_logs id    DEFAULT     n   ALTER TABLE ONLY public.email_logs ALTER COLUMN id SET DEFAULT nextval('public.email_logs_id_seq'::regclass);
 <   ALTER TABLE public.email_logs ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    357    356    357            ?           2604    34122    faqs id    DEFAULT     b   ALTER TABLE ONLY public.faqs ALTER COLUMN id SET DEFAULT nextval('public.faqs_id_seq'::regclass);
 6   ALTER TABLE public.faqs ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    263    262    263                       2604    36036    file_extension_types id    DEFAULT     ?   ALTER TABLE ONLY public.file_extension_types ALTER COLUMN id SET DEFAULT nextval('public.file_extension_types_id_seq'::regclass);
 F   ALTER TABLE public.file_extension_types ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    348    349    349                       2604    35701    file_types id    DEFAULT     n   ALTER TABLE ONLY public.file_types ALTER COLUMN id SET DEFAULT nextval('public.file_types_id_seq'::regclass);
 <   ALTER TABLE public.file_types ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    335    334    335            ?           2604    34182    help_chapter_sections id    DEFAULT     ?   ALTER TABLE ONLY public.help_chapter_sections ALTER COLUMN id SET DEFAULT nextval('public.help_chapter_sections_id_seq'::regclass);
 G   ALTER TABLE public.help_chapter_sections ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    274    275    275            ?           2604    34171    help_chapters id    DEFAULT     t   ALTER TABLE ONLY public.help_chapters ALTER COLUMN id SET DEFAULT nextval('public.help_chapters_id_seq'::regclass);
 ?   ALTER TABLE public.help_chapters ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    272    273    273            ?           2604    34160    help_sections id    DEFAULT     t   ALTER TABLE ONLY public.help_sections ALTER COLUMN id SET DEFAULT nextval('public.help_sections_id_seq'::regclass);
 ?   ALTER TABLE public.help_sections ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    270    271    271            ?           2604    25033    icons id    DEFAULT     d   ALTER TABLE ONLY public.icons ALTER COLUMN id SET DEFAULT nextval('public.icons_id_seq'::regclass);
 7   ALTER TABLE public.icons ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    211    210    211            ?           2604    25025 
   ip_logs id    DEFAULT     h   ALTER TABLE ONLY public.ip_logs ALTER COLUMN id SET DEFAULT nextval('public.ip_logs_id_seq'::regclass);
 9   ALTER TABLE public.ip_logs ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    208    209    209                       2604    35872    job_comment_types id    DEFAULT     |   ALTER TABLE ONLY public.job_comment_types ALTER COLUMN id SET DEFAULT nextval('public.job_comment_types_id_seq'::regclass);
 C   ALTER TABLE public.job_comment_types ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    341    340    341                       2604    35863    job_comments id    DEFAULT     r   ALTER TABLE ONLY public.job_comments ALTER COLUMN id SET DEFAULT nextval('public.job_comments_id_seq'::regclass);
 >   ALTER TABLE public.job_comments ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    338    339    339            ?           2604    35499    job_deadline_snapshots id    DEFAULT     ?   ALTER TABLE ONLY public.job_deadline_snapshots ALTER COLUMN id SET DEFAULT nextval('public.job_deadline_snapshots_id_seq'::regclass);
 H   ALTER TABLE public.job_deadline_snapshots ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    322    321    322                        2604    35524    job_deadline_types id    DEFAULT     ~   ALTER TABLE ONLY public.job_deadline_types ALTER COLUMN id SET DEFAULT nextval('public.job_deadline_types_id_seq'::regclass);
 D   ALTER TABLE public.job_deadline_types ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    324    323    324            ?           2604    34769    job_priority_types id    DEFAULT     ~   ALTER TABLE ONLY public.job_priority_types ALTER COLUMN id SET DEFAULT nextval('public.job_priority_types_id_seq'::regclass);
 D   ALTER TABLE public.job_priority_types ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    305    306    306            ?           2604    34753    job_quality_types id    DEFAULT     |   ALTER TABLE ONLY public.job_quality_types ALTER COLUMN id SET DEFAULT nextval('public.job_quality_types_id_seq'::regclass);
 C   ALTER TABLE public.job_quality_types ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    302    301    302            ?           2604    34898    job_status_logs id    DEFAULT     x   ALTER TABLE ONLY public.job_status_logs ALTER COLUMN id SET DEFAULT nextval('public.job_status_logs_id_seq'::regclass);
 A   ALTER TABLE public.job_status_logs ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    310    309    310            ?           2604    35459    job_status_snapshots id    DEFAULT     ?   ALTER TABLE ONLY public.job_status_snapshots ALTER COLUMN id SET DEFAULT nextval('public.job_status_snapshots_id_seq'::regclass);
 F   ALTER TABLE public.job_status_snapshots ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    320    319    320            ?           2604    34761    job_status_types id    DEFAULT     z   ALTER TABLE ONLY public.job_status_types ALTER COLUMN id SET DEFAULT nextval('public.job_status_types_id_seq'::regclass);
 B   ALTER TABLE public.job_status_types ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    304    303    304            ?           2604    33974    jobs id    DEFAULT     b   ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);
 6   ALTER TABLE public.jobs ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    255    256    256            ?           2604    34511    login_tokens id    DEFAULT     r   ALTER TABLE ONLY public.login_tokens ALTER COLUMN id SET DEFAULT nextval('public.login_tokens_id_seq'::regclass);
 >   ALTER TABLE public.login_tokens ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    292    293    293            ?           2604    16499    mailing_lists id    DEFAULT     t   ALTER TABLE ONLY public.mailing_lists ALTER COLUMN id SET DEFAULT nextval('public.mailing_lists_id_seq'::regclass);
 ?   ALTER TABLE public.mailing_lists ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    191    190    191            ?           2604    33762    materials id    DEFAULT     l   ALTER TABLE ONLY public.materials ALTER COLUMN id SET DEFAULT nextval('public.materials_id_seq'::regclass);
 ;   ALTER TABLE public.materials ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    242    243    243                       2604    35658 !   notification_read_status_types id    DEFAULT     ?   ALTER TABLE ONLY public.notification_read_status_types ALTER COLUMN id SET DEFAULT nextval('public.notification_read_status_types_id_seq'::regclass);
 P   ALTER TABLE public.notification_read_status_types ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    329    328    329                       2604    35666    notification_types id    DEFAULT     ~   ALTER TABLE ONLY public.notification_types ALTER COLUMN id SET DEFAULT nextval('public.notification_types_id_seq'::regclass);
 D   ALTER TABLE public.notification_types ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    331    330    331                       2604    35648    notifications id    DEFAULT     t   ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);
 ?   ALTER TABLE public.notifications ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    326    327    327                       2604    44257    oauth_authorization_codes id    DEFAULT     ?   ALTER TABLE ONLY public.oauth_authorization_codes ALTER COLUMN id SET DEFAULT nextval('public.oauth_authorization_codes_id_seq'::regclass);
 K   ALTER TABLE public.oauth_authorization_codes ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    360    361    361                       2604    44246    oauth_clients id    DEFAULT     t   ALTER TABLE ONLY public.oauth_clients ALTER COLUMN id SET DEFAULT nextval('public.oauth_clients_id_seq'::regclass);
 ?   ALTER TABLE public.oauth_clients ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    359    358    359            ?           2604    33600    payments id    DEFAULT     j   ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);
 :   ALTER TABLE public.payments ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    230    231    231            ?           2604    25001    permissions_levels id    DEFAULT     ~   ALTER TABLE ONLY public.permissions_levels ALTER COLUMN id SET DEFAULT nextval('public.permissions_levels_id_seq'::regclass);
 D   ALTER TABLE public.permissions_levels ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    206    207    207            ?           2604    34870    product_additional_files id    DEFAULT     ?   ALTER TABLE ONLY public.product_additional_files ALTER COLUMN id SET DEFAULT nextval('public.product_additional_files_id_seq'::regclass);
 J   ALTER TABLE public.product_additional_files ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    308    307    308                       2604    36017    product_combinations id    DEFAULT     ?   ALTER TABLE ONLY public.product_combinations ALTER COLUMN id SET DEFAULT nextval('public.product_combinations_id_seq'::regclass);
 F   ALTER TABLE public.product_combinations ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    344    345    345            &           2604    45032    product_favorites id    DEFAULT     |   ALTER TABLE ONLY public.product_favorites ALTER COLUMN id SET DEFAULT nextval('public.product_favorites_id_seq'::regclass);
 C   ALTER TABLE public.product_favorites ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    373    372    373            !           2604    44822 #   product_holding_reference_images id    DEFAULT     ?   ALTER TABLE ONLY public.product_holding_reference_images ALTER COLUMN id SET DEFAULT nextval('public.product_holding_reference_images_id_seq'::regclass);
 R   ALTER TABLE public.product_holding_reference_images ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    367    366    367            #           2604    44834    product_holding_types id    DEFAULT     ?   ALTER TABLE ONLY public.product_holding_types ALTER COLUMN id SET DEFAULT nextval('public.product_holding_types_id_seq'::regclass);
 G   ALTER TABLE public.product_holding_types ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    369    368    369                       2604    44807    product_holdings id    DEFAULT     z   ALTER TABLE ONLY public.product_holdings ALTER COLUMN id SET DEFAULT nextval('public.product_holdings_id_seq'::regclass);
 B   ALTER TABLE public.product_holdings ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    364    365    365            ?           2604    34152    product_reference_images id    DEFAULT     ?   ALTER TABLE ONLY public.product_reference_images ALTER COLUMN id SET DEFAULT nextval('public.product_reference_images_id_seq'::regclass);
 J   ALTER TABLE public.product_reference_images ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    268    269    269            ?           2604    33732    product_verticals id    DEFAULT     |   ALTER TABLE ONLY public.product_verticals ALTER COLUMN id SET DEFAULT nextval('public.product_verticals_id_seq'::regclass);
 C   ALTER TABLE public.product_verticals ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    241    240    241            ?           2604    33956    products id    DEFAULT     j   ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);
 :   ALTER TABLE public.products ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    254    253    254                       2604    44798    project_holdings id    DEFAULT     z   ALTER TABLE ONLY public.project_holdings ALTER COLUMN id SET DEFAULT nextval('public.project_holdings_id_seq'::regclass);
 B   ALTER TABLE public.project_holdings ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    362    363    363            ?           2604    34606    project_status_types id    DEFAULT     ?   ALTER TABLE ONLY public.project_status_types ALTER COLUMN id SET DEFAULT nextval('public.project_status_types_id_seq'::regclass);
 F   ALTER TABLE public.project_status_types ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    295    296    296            ?           2604    33812    projects id    DEFAULT     j   ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);
 :   ALTER TABLE public.projects ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    244    245    245            ?           2604    34142 %   rabbit_message_action_status_texts id    DEFAULT     ?   ALTER TABLE ONLY public.rabbit_message_action_status_texts ALTER COLUMN id SET DEFAULT nextval('public.rabbit_message_action_status_texts_id_seq'::regclass);
 T   ALTER TABLE public.rabbit_message_action_status_texts ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    266    267    267            ?           2604    34134    rabbit_message_action_types id    DEFAULT     ?   ALTER TABLE ONLY public.rabbit_message_action_types ALTER COLUMN id SET DEFAULT nextval('public.rabbit_message_action_types_id_seq'::regclass);
 M   ALTER TABLE public.rabbit_message_action_types ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    264    265    265            ?           2604    25198    rabbit_message_status_types id    DEFAULT     ?   ALTER TABLE ONLY public.rabbit_message_status_types ALTER COLUMN id SET DEFAULT nextval('public.rabbit_message_status_types_id_seq'::regclass);
 M   ALTER TABLE public.rabbit_message_status_types ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    220    221    221            ?           2604    25222    rabbit_messages id    DEFAULT     x   ALTER TABLE ONLY public.rabbit_messages ALTER COLUMN id SET DEFAULT nextval('public.rabbit_messages_id_seq'::regclass);
 A   ALTER TABLE public.rabbit_messages ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    223    222    223            ?           2604    25164    rework_messages id    DEFAULT     x   ALTER TABLE ONLY public.rework_messages ALTER COLUMN id SET DEFAULT nextval('public.rework_messages_id_seq'::regclass);
 A   ALTER TABLE public.rework_messages ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    219    219            ?           2604    16533    roles id    DEFAULT     d   ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);
 7   ALTER TABLE public.roles ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    195    196    196            ?           2604    24889    source_data_types id    DEFAULT     |   ALTER TABLE ONLY public.source_data_types ALTER COLUMN id SET DEFAULT nextval('public.source_data_types_id_seq'::regclass);
 C   ALTER TABLE public.source_data_types ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    203    202    203            ?           2604    16513    tags id    DEFAULT     b   ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);
 6   ALTER TABLE public.tags ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    193    187                       2604    36009    texture_types id    DEFAULT     t   ALTER TABLE ONLY public.texture_types ALTER COLUMN id SET DEFAULT nextval('public.texture_types_id_seq'::regclass);
 ?   ALTER TABLE public.texture_types ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    343    342    343            ?           2604    34020    unit_types id    DEFAULT     n   ALTER TABLE ONLY public.unit_types ALTER COLUMN id SET DEFAULT nextval('public.unit_types_id_seq'::regclass);
 <   ALTER TABLE public.unit_types ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    257    258    258                       2604    36260    user_agreement_responses id    DEFAULT     ?   ALTER TABLE ONLY public.user_agreement_responses ALTER COLUMN id SET DEFAULT nextval('public.user_agreement_responses_id_seq'::regclass);
 J   ALTER TABLE public.user_agreement_responses ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    354    355    355                       2604    36244    user_agreement_types id    DEFAULT     ?   ALTER TABLE ONLY public.user_agreement_types ALTER COLUMN id SET DEFAULT nextval('public.user_agreement_types_id_seq'::regclass);
 F   ALTER TABLE public.user_agreement_types ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    351    350    351                       2604    36252    user_agreements id    DEFAULT     x   ALTER TABLE ONLY public.user_agreements ALTER COLUMN id SET DEFAULT nextval('public.user_agreements_id_seq'::regclass);
 A   ALTER TABLE public.user_agreements ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    353    352    353            ?           2604    16517    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    194    189            ?           2604    33704    web_crawler_queries id    DEFAULT     ?   ALTER TABLE ONLY public.web_crawler_queries ALTER COLUMN id SET DEFAULT nextval('public.web_crawler_queries_id_seq'::regclass);
 E   ALTER TABLE public.web_crawler_queries ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    239    238    239            ?           2604    25099    zip_logs id    DEFAULT     j   ALTER TABLE ONLY public.zip_logs ALTER COLUMN id SET DEFAULT nextval('public.zip_logs_id_seq'::regclass);
 :   ALTER TABLE public.zip_logs ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    212    213    213            ?           2606    35642     SequelizeMeta SequelizeMeta_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);
 N   ALTER TABLE ONLY public."SequelizeMeta" DROP CONSTRAINT "SequelizeMeta_pkey";
       public            postgres    false    325                       2606    44894 /   asset_ab_alternatives asset_ab_alternative_pkey 
   CONSTRAINT     m   ALTER TABLE ONLY public.asset_ab_alternatives
    ADD CONSTRAINT asset_ab_alternative_pkey PRIMARY KEY (id);
 Y   ALTER TABLE ONLY public.asset_ab_alternatives DROP CONSTRAINT asset_ab_alternative_pkey;
       public            postgres    false    371            u           2606    33665 2   asset_complexity_types asset_complexity_types_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public.asset_complexity_types
    ADD CONSTRAINT asset_complexity_types_pkey PRIMARY KEY (id);
 \   ALTER TABLE ONLY public.asset_complexity_types DROP CONSTRAINT asset_complexity_types_pkey;
       public            postgres    false    233            ?           2606    35695    asset_files asset_files_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.asset_files
    ADD CONSTRAINT asset_files_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.asset_files DROP CONSTRAINT asset_files_pkey;
       public            postgres    false    333            k           2606    25455 (   asset_issue_types asset_issue_types_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.asset_issue_types
    ADD CONSTRAINT asset_issue_types_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.asset_issue_types DROP CONSTRAINT asset_issue_types_pkey;
       public            postgres    false    225            m           2606    25474    asset_issues asset_issues_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.asset_issues
    ADD CONSTRAINT asset_issues_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.asset_issues DROP CONSTRAINT asset_issues_pkey;
       public            postgres    false    227            ?           2606    33877 *   asset_metric_types asset_metric_types_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.asset_metric_types
    ADD CONSTRAINT asset_metric_types_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.asset_metric_types DROP CONSTRAINT asset_metric_types_pkey;
       public            postgres    false    248            ?           2606    33912     asset_metrics asset_metrics_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.asset_metrics
    ADD CONSTRAINT asset_metrics_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.asset_metrics DROP CONSTRAINT asset_metrics_pkey;
       public            postgres    false    252            ?           2606    35369     asset_renders asset_renders_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.asset_renders
    ADD CONSTRAINT asset_renders_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.asset_renders DROP CONSTRAINT asset_renders_pkey;
       public            postgres    false    318            ?           2606    35794 $   asset_spin_sets asset_spin_sets_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.asset_spin_sets
    ADD CONSTRAINT asset_spin_sets_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.asset_spin_sets DROP CONSTRAINT asset_spin_sets_pkey;
       public            postgres    false    337            ?           2606    34464 P   asset_submission_issue_category_types asset_submission_issue_category_types_pkey 
   CONSTRAINT     ?   ALTER TABLE ONLY public.asset_submission_issue_category_types
    ADD CONSTRAINT asset_submission_issue_category_types_pkey PRIMARY KEY (id);
 z   ALTER TABLE ONLY public.asset_submission_issue_category_types DROP CONSTRAINT asset_submission_issue_category_types_pkey;
       public            postgres    false    289            ?           2606    35270 D   asset_submission_issue_hotspots asset_submission_issue_hotspots_pkey 
   CONSTRAINT     ?   ALTER TABLE ONLY public.asset_submission_issue_hotspots
    ADD CONSTRAINT asset_submission_issue_hotspots_pkey PRIMARY KEY (id);
 n   ALTER TABLE ONLY public.asset_submission_issue_hotspots DROP CONSTRAINT asset_submission_issue_hotspots_pkey;
       public            postgres    false    316            ?           2606    35181 @   asset_submission_issue_images asset_submission_issue_images_pkey 
   CONSTRAINT     ~   ALTER TABLE ONLY public.asset_submission_issue_images
    ADD CONSTRAINT asset_submission_issue_images_pkey PRIMARY KEY (id);
 j   ALTER TABLE ONLY public.asset_submission_issue_images DROP CONSTRAINT asset_submission_issue_images_pkey;
       public            postgres    false    312            ?           2606    34480 >   asset_submission_issue_types asset_submission_issue_types_pkey 
   CONSTRAINT     |   ALTER TABLE ONLY public.asset_submission_issue_types
    ADD CONSTRAINT asset_submission_issue_types_pkey PRIMARY KEY (id);
 h   ALTER TABLE ONLY public.asset_submission_issue_types DROP CONSTRAINT asset_submission_issue_types_pkey;
       public            postgres    false    291            ?           2606    35220 4   asset_submission_issues asset_submission_issues_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.asset_submission_issues
    ADD CONSTRAINT asset_submission_issues_pkey PRIMARY KEY (id);
 ^   ALTER TABLE ONLY public.asset_submission_issues DROP CONSTRAINT asset_submission_issues_pkey;
       public            postgres    false    314            ?           2606    34498 R   asset_submission_renders asset_submission_renders_asset_submission_id_filename_key 
   CONSTRAINT     ?   ALTER TABLE ONLY public.asset_submission_renders
    ADD CONSTRAINT asset_submission_renders_asset_submission_id_filename_key UNIQUE (asset_submission_id, filename);
 |   ALTER TABLE ONLY public.asset_submission_renders DROP CONSTRAINT asset_submission_renders_asset_submission_id_filename_key;
       public            postgres    false    287    287            ?           2606    34432 6   asset_submission_renders asset_submission_renders_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY public.asset_submission_renders
    ADD CONSTRAINT asset_submission_renders_pkey PRIMARY KEY (id);
 `   ALTER TABLE ONLY public.asset_submission_renders DROP CONSTRAINT asset_submission_renders_pkey;
       public            postgres    false    287            ?           2606    34417 @   asset_submission_status_types asset_submission_status_types_pkey 
   CONSTRAINT     ~   ALTER TABLE ONLY public.asset_submission_status_types
    ADD CONSTRAINT asset_submission_status_types_pkey PRIMARY KEY (id);
 j   ALTER TABLE ONLY public.asset_submission_status_types DROP CONSTRAINT asset_submission_status_types_pkey;
       public            postgres    false    285            ?           2606    35414 T   asset_submission_textures asset_submission_textures_asset_submission_id_filename_key 
   CONSTRAINT     ?   ALTER TABLE ONLY public.asset_submission_textures
    ADD CONSTRAINT asset_submission_textures_asset_submission_id_filename_key UNIQUE (asset_submission_id, filename);
 ~   ALTER TABLE ONLY public.asset_submission_textures DROP CONSTRAINT asset_submission_textures_asset_submission_id_filename_key;
       public            postgres    false    281    281            ?           2606    34347 8   asset_submission_textures asset_submission_textures_pkey 
   CONSTRAINT     v   ALTER TABLE ONLY public.asset_submission_textures
    ADD CONSTRAINT asset_submission_textures_pkey PRIMARY KEY (id);
 b   ALTER TABLE ONLY public.asset_submission_textures DROP CONSTRAINT asset_submission_textures_pkey;
       public            postgres    false    281            ?           2606    34277 (   asset_submissions asset_submissions_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.asset_submissions
    ADD CONSTRAINT asset_submissions_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.asset_submissions DROP CONSTRAINT asset_submissions_pkey;
       public            postgres    false    279            /           2606    16451    asset_tags asset_tags_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.asset_tags
    ADD CONSTRAINT asset_tags_pkey PRIMARY KEY (asset_id, tag_id);
 D   ALTER TABLE ONLY public.asset_tags DROP CONSTRAINT asset_tags_pkey;
       public            postgres    false    185    185                       2606    36030 "   asset_textures asset_textures_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.asset_textures
    ADD CONSTRAINT asset_textures_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.asset_textures DROP CONSTRAINT asset_textures_pkey;
       public            postgres    false    347            c           2606    25151 (   asset_upload_logs asset_upload_logs_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.asset_upload_logs
    ADD CONSTRAINT asset_upload_logs_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.asset_upload_logs DROP CONSTRAINT asset_upload_logs_pkey;
       public            postgres    false    217            ?           2606    34052    asset_xrids asset_xrids_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.asset_xrids
    ADD CONSTRAINT asset_xrids_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.asset_xrids DROP CONSTRAINT asset_xrids_pkey;
       public            postgres    false    260            1           2606    16453    assets assets_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.assets DROP CONSTRAINT assets_pkey;
       public            postgres    false    186            3           2606    16455    assets assets_uid_key 
   CONSTRAINT     O   ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_uid_key UNIQUE (uid);
 ?   ALTER TABLE ONLY public.assets DROP CONSTRAINT assets_uid_key;
       public            postgres    false    186            y           2606    33698 2   assignment_artist_logs assignment_artist_logs_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public.assignment_artist_logs
    ADD CONSTRAINT assignment_artist_logs_pkey PRIMARY KEY (id);
 \   ALTER TABLE ONLY public.assignment_artist_logs DROP CONSTRAINT assignment_artist_logs_pkey;
       public            postgres    false    237            ?           2606    33858 .   assignment_materials assignment_materials_pkey 
   CONSTRAINT     ?   ALTER TABLE ONLY public.assignment_materials
    ADD CONSTRAINT assignment_materials_pkey PRIMARY KEY (assignment_id, material_id);
 X   ALTER TABLE ONLY public.assignment_materials DROP CONSTRAINT assignment_materials_pkey;
       public            postgres    false    246    246            a           2606    25129 8   assignment_modeling_types assignment_modeling_types_pkey 
   CONSTRAINT     v   ALTER TABLE ONLY public.assignment_modeling_types
    ADD CONSTRAINT assignment_modeling_types_pkey PRIMARY KEY (id);
 b   ALTER TABLE ONLY public.assignment_modeling_types DROP CONSTRAINT assignment_modeling_types_pkey;
       public            postgres    false    215            o           2606    33555 ,   assignment_payments assignment_payments_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.assignment_payments
    ADD CONSTRAINT assignment_payments_pkey PRIMARY KEY (id);
 V   ALTER TABLE ONLY public.assignment_payments DROP CONSTRAINT assignment_payments_pkey;
       public            postgres    false    229            w           2606    33673 8   assignment_priority_types assignment_priority_types_pkey 
   CONSTRAINT     v   ALTER TABLE ONLY public.assignment_priority_types
    ADD CONSTRAINT assignment_priority_types_pkey PRIMARY KEY (id);
 b   ALTER TABLE ONLY public.assignment_priority_types DROP CONSTRAINT assignment_priority_types_pkey;
       public            postgres    false    235            ?           2606    34269 2   assignment_rework_logs assignment_rework_logs_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public.assignment_rework_logs
    ADD CONSTRAINT assignment_rework_logs_pkey PRIMARY KEY (id);
 \   ALTER TABLE ONLY public.assignment_rework_logs DROP CONSTRAINT assignment_rework_logs_pkey;
       public            postgres    false    277            K           2606    24848 0   assignment_status_types assignment_statuses_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY public.assignment_status_types
    ADD CONSTRAINT assignment_statuses_pkey PRIMARY KEY (id);
 Z   ALTER TABLE ONLY public.assignment_status_types DROP CONSTRAINT assignment_statuses_pkey;
       public            postgres    false    199            M           2606    24865    assignments assignments_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.assignments DROP CONSTRAINT assignments_pkey;
       public            postgres    false    201            O           2606    24867    assignments assignments_uid_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_uid_key UNIQUE (uid);
 I   ALTER TABLE ONLY public.assignments DROP CONSTRAINT assignments_uid_key;
       public            postgres    false    201                       2606    45060 "   base_materials base_materials_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.base_materials
    ADD CONSTRAINT base_materials_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.base_materials DROP CONSTRAINT base_materials_pkey;
       public            postgres    false    375                        2606    45062 %   base_materials base_materials_uid_key 
   CONSTRAINT     _   ALTER TABLE ONLY public.base_materials
    ADD CONSTRAINT base_materials_uid_key UNIQUE (uid);
 O   ALTER TABLE ONLY public.base_materials DROP CONSTRAINT base_materials_uid_key;
       public            postgres    false    375            ?           2606    34404 "   blender_addons blender_addons_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.blender_addons
    ADD CONSTRAINT blender_addons_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.blender_addons DROP CONSTRAINT blender_addons_pkey;
       public            postgres    false    283            ?           2606    34406 )   blender_addons blender_addons_version_key 
   CONSTRAINT     g   ALTER TABLE ONLY public.blender_addons
    ADD CONSTRAINT blender_addons_version_key UNIQUE (version);
 S   ALTER TABLE ONLY public.blender_addons DROP CONSTRAINT blender_addons_version_key;
       public            postgres    false    283            ?           2606    34715     client_brands client_brands_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.client_brands
    ADD CONSTRAINT client_brands_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.client_brands DROP CONSTRAINT client_brands_pkey;
       public            postgres    false    298            ?           2606    34741 "   client_classes client_classes_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.client_classes
    ADD CONSTRAINT client_classes_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.client_classes DROP CONSTRAINT client_classes_pkey;
       public            postgres    false    300            S           2606    24929    clients clients_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.clients DROP CONSTRAINT clients_pkey;
       public            postgres    false    205            U           2606    24931    clients clients_uid_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_uid_key UNIQUE (uid);
 A   ALTER TABLE ONLY public.clients DROP CONSTRAINT clients_uid_key;
       public            postgres    false    205            5           2606    16457    tags dev_tags_name_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.tags
    ADD CONSTRAINT dev_tags_name_key UNIQUE (name);
 @   ALTER TABLE ONLY public.tags DROP CONSTRAINT dev_tags_name_key;
       public            postgres    false    187            7           2606    16459    tags dev_tags_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.tags
    ADD CONSTRAINT dev_tags_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.tags DROP CONSTRAINT dev_tags_pkey;
       public            postgres    false    187            ?           2606    33901    device_types device_types_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.device_types
    ADD CONSTRAINT device_types_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.device_types DROP CONSTRAINT device_types_pkey;
       public            postgres    false    250                       2606    36274    email_logs email_logs_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.email_logs
    ADD CONSTRAINT email_logs_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.email_logs DROP CONSTRAINT email_logs_pkey;
       public            postgres    false    357            9           2606    16461    errors errors_hash_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.errors
    ADD CONSTRAINT errors_hash_key UNIQUE (hash);
 @   ALTER TABLE ONLY public.errors DROP CONSTRAINT errors_hash_key;
       public            postgres    false    188            ;           2606    16463    errors errors_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.errors
    ADD CONSTRAINT errors_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.errors DROP CONSTRAINT errors_pkey;
       public            postgres    false    188            ?           2606    34127    faqs faqs_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.faqs
    ADD CONSTRAINT faqs_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.faqs DROP CONSTRAINT faqs_pkey;
       public            postgres    false    263                       2606    36038 .   file_extension_types file_extension_types_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.file_extension_types
    ADD CONSTRAINT file_extension_types_pkey PRIMARY KEY (id);
 X   ALTER TABLE ONLY public.file_extension_types DROP CONSTRAINT file_extension_types_pkey;
       public            postgres    false    349            ?           2606    35703    file_types file_types_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.file_types
    ADD CONSTRAINT file_types_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.file_types DROP CONSTRAINT file_types_pkey;
       public            postgres    false    335            ?           2606    34187 0   help_chapter_sections help_chapter_sections_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY public.help_chapter_sections
    ADD CONSTRAINT help_chapter_sections_pkey PRIMARY KEY (id);
 Z   ALTER TABLE ONLY public.help_chapter_sections DROP CONSTRAINT help_chapter_sections_pkey;
       public            postgres    false    275            ?           2606    34176     help_chapters help_chapters_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.help_chapters
    ADD CONSTRAINT help_chapters_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.help_chapters DROP CONSTRAINT help_chapters_pkey;
       public            postgres    false    273            ?           2606    34165     help_sections help_sections_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.help_sections
    ADD CONSTRAINT help_sections_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.help_sections DROP CONSTRAINT help_sections_pkey;
       public            postgres    false    271            [           2606    25037    icons icons_name_key 
   CONSTRAINT     O   ALTER TABLE ONLY public.icons
    ADD CONSTRAINT icons_name_key UNIQUE (name);
 >   ALTER TABLE ONLY public.icons DROP CONSTRAINT icons_name_key;
       public            postgres    false    211            ]           2606    25035    icons icons_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.icons
    ADD CONSTRAINT icons_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.icons DROP CONSTRAINT icons_pkey;
       public            postgres    false    211            Y           2606    25027    ip_logs ip_logs_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.ip_logs
    ADD CONSTRAINT ip_logs_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.ip_logs DROP CONSTRAINT ip_logs_pkey;
       public            postgres    false    209            ?           2606    35874 (   job_comment_types job_comment_types_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.job_comment_types
    ADD CONSTRAINT job_comment_types_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.job_comment_types DROP CONSTRAINT job_comment_types_pkey;
       public            postgres    false    341            ?           2606    35866    job_comments job_comments_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.job_comments
    ADD CONSTRAINT job_comments_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.job_comments DROP CONSTRAINT job_comments_pkey;
       public            postgres    false    339            ?           2606    35501 2   job_deadline_snapshots job_deadline_snapshots_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public.job_deadline_snapshots
    ADD CONSTRAINT job_deadline_snapshots_pkey PRIMARY KEY (id);
 \   ALTER TABLE ONLY public.job_deadline_snapshots DROP CONSTRAINT job_deadline_snapshots_pkey;
       public            postgres    false    322            ?           2606    35526 *   job_deadline_types job_deadline_types_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.job_deadline_types
    ADD CONSTRAINT job_deadline_types_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.job_deadline_types DROP CONSTRAINT job_deadline_types_pkey;
       public            postgres    false    324            ?           2606    34771 *   job_priority_types job_priority_types_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.job_priority_types
    ADD CONSTRAINT job_priority_types_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.job_priority_types DROP CONSTRAINT job_priority_types_pkey;
       public            postgres    false    306            ?           2606    34755 (   job_quality_types job_quality_types_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.job_quality_types
    ADD CONSTRAINT job_quality_types_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.job_quality_types DROP CONSTRAINT job_quality_types_pkey;
       public            postgres    false    302            ?           2606    34900 $   job_status_logs job_status_logs_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.job_status_logs
    ADD CONSTRAINT job_status_logs_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.job_status_logs DROP CONSTRAINT job_status_logs_pkey;
       public            postgres    false    310            ?           2606    35465 @   job_status_snapshots job_status_snapshots_date_job_status_id_key 
   CONSTRAINT     ?   ALTER TABLE ONLY public.job_status_snapshots
    ADD CONSTRAINT job_status_snapshots_date_job_status_id_key UNIQUE (date, job_status_id);
 j   ALTER TABLE ONLY public.job_status_snapshots DROP CONSTRAINT job_status_snapshots_date_job_status_id_key;
       public            postgres    false    320    320            ?           2606    35461 .   job_status_snapshots job_status_snapshots_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.job_status_snapshots
    ADD CONSTRAINT job_status_snapshots_pkey PRIMARY KEY (id);
 X   ALTER TABLE ONLY public.job_status_snapshots DROP CONSTRAINT job_status_snapshots_pkey;
       public            postgres    false    320            ?           2606    34763 &   job_status_types job_status_types_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.job_status_types
    ADD CONSTRAINT job_status_types_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.job_status_types DROP CONSTRAINT job_status_types_pkey;
       public            postgres    false    304            ?           2606    33984    jobs jobs_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.jobs DROP CONSTRAINT jobs_pkey;
       public            postgres    false    256            ?           2606    33986    jobs jobs_uid_key 
   CONSTRAINT     K   ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_uid_key UNIQUE (uid);
 ;   ALTER TABLE ONLY public.jobs DROP CONSTRAINT jobs_uid_key;
       public            postgres    false    256            ?           2606    34513    login_tokens login_tokens_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.login_tokens
    ADD CONSTRAINT login_tokens_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.login_tokens DROP CONSTRAINT login_tokens_pkey;
       public            postgres    false    293            ?           2606    34515 #   login_tokens login_tokens_token_key 
   CONSTRAINT     _   ALTER TABLE ONLY public.login_tokens
    ADD CONSTRAINT login_tokens_token_key UNIQUE (token);
 M   ALTER TABLE ONLY public.login_tokens DROP CONSTRAINT login_tokens_token_key;
       public            postgres    false    293            C           2606    16504     mailing_lists mailing_lists_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.mailing_lists
    ADD CONSTRAINT mailing_lists_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.mailing_lists DROP CONSTRAINT mailing_lists_pkey;
       public            postgres    false    191            ?           2606    33767    materials materials_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.materials
    ADD CONSTRAINT materials_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.materials DROP CONSTRAINT materials_pkey;
       public            postgres    false    243            ?           2606    33769    materials materials_uid_key 
   CONSTRAINT     U   ALTER TABLE ONLY public.materials
    ADD CONSTRAINT materials_uid_key UNIQUE (uid);
 E   ALTER TABLE ONLY public.materials DROP CONSTRAINT materials_uid_key;
       public            postgres    false    243            ?           2606    35660 B   notification_read_status_types notification_read_status_types_pkey 
   CONSTRAINT     ?   ALTER TABLE ONLY public.notification_read_status_types
    ADD CONSTRAINT notification_read_status_types_pkey PRIMARY KEY (id);
 l   ALTER TABLE ONLY public.notification_read_status_types DROP CONSTRAINT notification_read_status_types_pkey;
       public            postgres    false    329            ?           2606    35668 *   notification_types notification_types_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.notification_types
    ADD CONSTRAINT notification_types_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.notification_types DROP CONSTRAINT notification_types_pkey;
       public            postgres    false    331            ?           2606    35652     notifications notifications_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.notifications DROP CONSTRAINT notifications_pkey;
       public            postgres    false    327                       2606    44262 8   oauth_authorization_codes oauth_authorization_codes_pkey 
   CONSTRAINT     v   ALTER TABLE ONLY public.oauth_authorization_codes
    ADD CONSTRAINT oauth_authorization_codes_pkey PRIMARY KEY (id);
 b   ALTER TABLE ONLY public.oauth_authorization_codes DROP CONSTRAINT oauth_authorization_codes_pkey;
       public            postgres    false    361                       2606    44251     oauth_clients oauth_clients_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.oauth_clients DROP CONSTRAINT oauth_clients_pkey;
       public            postgres    false    359            q           2606    33605    payments payments_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.payments DROP CONSTRAINT payments_pkey;
       public            postgres    false    231            s           2606    33607    payments payments_uid_key 
   CONSTRAINT     S   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_uid_key UNIQUE (uid);
 C   ALTER TABLE ONLY public.payments DROP CONSTRAINT payments_uid_key;
       public            postgres    false    231            W           2606    25003 *   permissions_levels permissions_levels_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.permissions_levels
    ADD CONSTRAINT permissions_levels_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.permissions_levels DROP CONSTRAINT permissions_levels_pkey;
       public            postgres    false    207            ?           2606    34872 6   product_additional_files product_additional_files_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY public.product_additional_files
    ADD CONSTRAINT product_additional_files_pkey PRIMARY KEY (id);
 `   ALTER TABLE ONLY public.product_additional_files DROP CONSTRAINT product_additional_files_pkey;
       public            postgres    false    308                        2606    36019 .   product_combinations product_combinations_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.product_combinations
    ADD CONSTRAINT product_combinations_pkey PRIMARY KEY (id);
 X   ALTER TABLE ONLY public.product_combinations DROP CONSTRAINT product_combinations_pkey;
       public            postgres    false    345                       2606    45034 (   product_favorites product_favorites_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.product_favorites
    ADD CONSTRAINT product_favorites_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.product_favorites DROP CONSTRAINT product_favorites_pkey;
       public            postgres    false    373                       2606    44828 F   product_holding_reference_images product_holding_reference_images_pkey 
   CONSTRAINT     ?   ALTER TABLE ONLY public.product_holding_reference_images
    ADD CONSTRAINT product_holding_reference_images_pkey PRIMARY KEY (id);
 p   ALTER TABLE ONLY public.product_holding_reference_images DROP CONSTRAINT product_holding_reference_images_pkey;
       public            postgres    false    367                       2606    44836 0   product_holding_types product_holding_types_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY public.product_holding_types
    ADD CONSTRAINT product_holding_types_pkey PRIMARY KEY (id);
 Z   ALTER TABLE ONLY public.product_holding_types DROP CONSTRAINT product_holding_types_pkey;
       public            postgres    false    369                       2606    44816 &   product_holdings product_holdings_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.product_holdings
    ADD CONSTRAINT product_holdings_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.product_holdings DROP CONSTRAINT product_holdings_pkey;
       public            postgres    false    365            ?           2606    34061 (   product_materials product_materials_pkey 
   CONSTRAINT     {   ALTER TABLE ONLY public.product_materials
    ADD CONSTRAINT product_materials_pkey PRIMARY KEY (product_id, material_id);
 R   ALTER TABLE ONLY public.product_materials DROP CONSTRAINT product_materials_pkey;
       public            postgres    false    261    261            ?           2606    34154 6   product_reference_images product_reference_images_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY public.product_reference_images
    ADD CONSTRAINT product_reference_images_pkey PRIMARY KEY (id);
 `   ALTER TABLE ONLY public.product_reference_images DROP CONSTRAINT product_reference_images_pkey;
       public            postgres    false    269            }           2606    33737 (   product_verticals product_verticals_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.product_verticals
    ADD CONSTRAINT product_verticals_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.product_verticals DROP CONSTRAINT product_verticals_pkey;
       public            postgres    false    241                       2606    33739 +   product_verticals product_verticals_uid_key 
   CONSTRAINT     e   ALTER TABLE ONLY public.product_verticals
    ADD CONSTRAINT product_verticals_uid_key UNIQUE (uid);
 U   ALTER TABLE ONLY public.product_verticals DROP CONSTRAINT product_verticals_uid_key;
       public            postgres    false    241            ?           2606    33966    products products_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.products DROP CONSTRAINT products_pkey;
       public            postgres    false    254            ?           2606    33968    products products_uid_key 
   CONSTRAINT     S   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_uid_key UNIQUE (uid);
 C   ALTER TABLE ONLY public.products DROP CONSTRAINT products_uid_key;
       public            postgres    false    254                       2606    44801 &   project_holdings project_holdings_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.project_holdings
    ADD CONSTRAINT project_holdings_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.project_holdings DROP CONSTRAINT project_holdings_pkey;
       public            postgres    false    363            ?           2606    34608 .   project_status_types project_status_types_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.project_status_types
    ADD CONSTRAINT project_status_types_pkey PRIMARY KEY (id);
 X   ALTER TABLE ONLY public.project_status_types DROP CONSTRAINT project_status_types_pkey;
       public            postgres    false    296            ?           2606    33819    projects projects_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.projects DROP CONSTRAINT projects_pkey;
       public            postgres    false    245            ?           2606    33821    projects projects_uid_key 
   CONSTRAINT     S   ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_uid_key UNIQUE (uid);
 C   ALTER TABLE ONLY public.projects DROP CONSTRAINT projects_uid_key;
       public            postgres    false    245            ?           2606    34144 J   rabbit_message_action_status_texts rabbit_message_action_status_texts_pkey 
   CONSTRAINT     ?   ALTER TABLE ONLY public.rabbit_message_action_status_texts
    ADD CONSTRAINT rabbit_message_action_status_texts_pkey PRIMARY KEY (id);
 t   ALTER TABLE ONLY public.rabbit_message_action_status_texts DROP CONSTRAINT rabbit_message_action_status_texts_pkey;
       public            postgres    false    267            ?           2606    34136 <   rabbit_message_action_types rabbit_message_action_types_pkey 
   CONSTRAINT     z   ALTER TABLE ONLY public.rabbit_message_action_types
    ADD CONSTRAINT rabbit_message_action_types_pkey PRIMARY KEY (id);
 f   ALTER TABLE ONLY public.rabbit_message_action_types DROP CONSTRAINT rabbit_message_action_types_pkey;
       public            postgres    false    265            g           2606    25200 <   rabbit_message_status_types rabbit_message_status_types_pkey 
   CONSTRAINT     z   ALTER TABLE ONLY public.rabbit_message_status_types
    ADD CONSTRAINT rabbit_message_status_types_pkey PRIMARY KEY (id);
 f   ALTER TABLE ONLY public.rabbit_message_status_types DROP CONSTRAINT rabbit_message_status_types_pkey;
       public            postgres    false    221            i           2606    25227 $   rabbit_messages rabbit_messages_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.rabbit_messages
    ADD CONSTRAINT rabbit_messages_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.rabbit_messages DROP CONSTRAINT rabbit_messages_pkey;
       public            postgres    false    223            e           2606    25169 $   rework_messages rework_messages_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.rework_messages
    ADD CONSTRAINT rework_messages_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.rework_messages DROP CONSTRAINT rework_messages_pkey;
       public            postgres    false    219            E           2606    16537    roles roles_name_key 
   CONSTRAINT     O   ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);
 >   ALTER TABLE ONLY public.roles DROP CONSTRAINT roles_name_key;
       public            postgres    false    196            G           2606    16535    roles roles_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.roles DROP CONSTRAINT roles_pkey;
       public            postgres    false    196            Q           2606    24891 (   source_data_types source_data_types_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.source_data_types
    ADD CONSTRAINT source_data_types_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.source_data_types DROP CONSTRAINT source_data_types_pkey;
       public            postgres    false    203            ?           2606    36011     texture_types texture_types_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.texture_types
    ADD CONSTRAINT texture_types_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.texture_types DROP CONSTRAINT texture_types_pkey;
       public            postgres    false    343            ?           2606    34022    unit_types unit_types_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.unit_types
    ADD CONSTRAINT unit_types_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.unit_types DROP CONSTRAINT unit_types_pkey;
       public            postgres    false    258            
           2606    36263 6   user_agreement_responses user_agreement_responses_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY public.user_agreement_responses
    ADD CONSTRAINT user_agreement_responses_pkey PRIMARY KEY (id);
 `   ALTER TABLE ONLY public.user_agreement_responses DROP CONSTRAINT user_agreement_responses_pkey;
       public            postgres    false    355                       2606    36246 .   user_agreement_types user_agreement_types_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.user_agreement_types
    ADD CONSTRAINT user_agreement_types_pkey PRIMARY KEY (id);
 X   ALTER TABLE ONLY public.user_agreement_types DROP CONSTRAINT user_agreement_types_pkey;
       public            postgres    false    351                       2606    36254 $   user_agreements user_agreements_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.user_agreements
    ADD CONSTRAINT user_agreements_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.user_agreements DROP CONSTRAINT user_agreements_pkey;
       public            postgres    false    353            ?           2606    34549    user_clients user_clients_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.user_clients
    ADD CONSTRAINT user_clients_pkey PRIMARY KEY (user_id, client_id);
 H   ALTER TABLE ONLY public.user_clients DROP CONSTRAINT user_clients_pkey;
       public            postgres    false    294    294            I           2606    16602    user_roles user_roles_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id);
 D   ALTER TABLE ONLY public.user_roles DROP CONSTRAINT user_roles_pkey;
       public            postgres    false    197    197            =           2606    34078    users users_api_token_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_api_token_key UNIQUE (api_token);
 C   ALTER TABLE ONLY public.users DROP CONSTRAINT users_api_token_key;
       public            postgres    false    189            ?           2606    16481    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    189            A           2606    16483    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public            postgres    false    189            {           2606    33706 ,   web_crawler_queries web_crawler_queries_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.web_crawler_queries
    ADD CONSTRAINT web_crawler_queries_pkey PRIMARY KEY (id);
 V   ALTER TABLE ONLY public.web_crawler_queries DROP CONSTRAINT web_crawler_queries_pkey;
       public            postgres    false    239            _           2606    25101    zip_logs zip_logs_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.zip_logs
    ADD CONSTRAINT zip_logs_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.zip_logs DROP CONSTRAINT zip_logs_pkey;
       public            postgres    false    213            ?           1259    35795 5   asset_spin_sets_asset_id_angle_resolution_image_count    INDEX     ?   CREATE INDEX asset_spin_sets_asset_id_angle_resolution_image_count ON public.asset_spin_sets USING btree (asset_id, angle, resolution, image_count);
 I   DROP INDEX public.asset_spin_sets_asset_id_angle_resolution_image_count;
       public            postgres    false    337    337    337    337            ?           1259    35510 #   job_deadline_snapshots_date_type_id    INDEX     v   CREATE UNIQUE INDEX job_deadline_snapshots_date_type_id ON public.job_deadline_snapshots USING btree (date, type_id);
 7   DROP INDEX public.job_deadline_snapshots_date_type_id;
       public            postgres    false    322    322            ?           1259    34145 6   rabbit_message_action_status_texts_action_id_status_id    INDEX     ?   CREATE UNIQUE INDEX rabbit_message_action_status_texts_action_id_status_id ON public.rabbit_message_action_status_texts USING btree (action_id, status_id);
 J   DROP INDEX public.rabbit_message_action_status_texts_action_id_status_id;
       public            postgres    false    267    267            1           2606    35221 H   asset_submission_issues asset_submission_issues_asset_submission_id_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.asset_submission_issues
    ADD CONSTRAINT asset_submission_issues_asset_submission_id_fkey FOREIGN KEY (asset_submission_id) REFERENCES public.asset_submissions(id) ON UPDATE CASCADE ON DELETE CASCADE;
 r   ALTER TABLE ONLY public.asset_submission_issues DROP CONSTRAINT asset_submission_issues_asset_submission_id_fkey;
       public          postgres    false    3504    314    279            ,           2606    34278 1   asset_submissions asset_submissions_asset_id_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.asset_submissions
    ADD CONSTRAINT asset_submissions_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.assets(id) ON UPDATE CASCADE ON DELETE CASCADE;
 [   ALTER TABLE ONLY public.asset_submissions DROP CONSTRAINT asset_submissions_asset_id_fkey;
       public          postgres    false    279    186    3377            !           2606    16484 #   asset_tags asset_tags_asset_id_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.asset_tags
    ADD CONSTRAINT asset_tags_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.assets(id) ON UPDATE CASCADE ON DELETE CASCADE;
 M   ALTER TABLE ONLY public.asset_tags DROP CONSTRAINT asset_tags_asset_id_fkey;
       public          postgres    false    185    3377    186            "           2606    16489 %   asset_tags asset_tags_dev_tag_id_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.asset_tags
    ADD CONSTRAINT asset_tags_dev_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON UPDATE CASCADE ON DELETE CASCADE;
 O   ALTER TABLE ONLY public.asset_tags DROP CONSTRAINT asset_tags_dev_tag_id_fkey;
       public          postgres    false    3383    187    185            %           2606    25152 1   asset_upload_logs asset_upload_logs_asset_id_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.asset_upload_logs
    ADD CONSTRAINT asset_upload_logs_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.assets(id) ON UPDATE CASCADE ON DELETE SET NULL;
 [   ALTER TABLE ONLY public.asset_upload_logs DROP CONSTRAINT asset_upload_logs_asset_id_fkey;
       public          postgres    false    3377    217    186            (           2606    33859 <   assignment_materials assignment_materials_assignment_id_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.assignment_materials
    ADD CONSTRAINT assignment_materials_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.assignments(id) ON UPDATE CASCADE ON DELETE CASCADE;
 f   ALTER TABLE ONLY public.assignment_materials DROP CONSTRAINT assignment_materials_assignment_id_fkey;
       public          postgres    false    201    246    3405            )           2606    33864 :   assignment_materials assignment_materials_material_id_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.assignment_materials
    ADD CONSTRAINT assignment_materials_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.materials(id) ON UPDATE CASCADE ON DELETE CASCADE;
 d   ALTER TABLE ONLY public.assignment_materials DROP CONSTRAINT assignment_materials_material_id_fkey;
       public          postgres    false    243    3457    246            0           2606    34716 *   client_brands client_brands_client_id_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.client_brands
    ADD CONSTRAINT client_brands_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON UPDATE CASCADE ON DELETE CASCADE;
 T   ALTER TABLE ONLY public.client_brands DROP CONSTRAINT client_brands_client_id_fkey;
       public          postgres    false    3411    298    205            -           2606    34521 &   login_tokens login_tokens_user_id_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.login_tokens
    ADD CONSTRAINT login_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
 P   ALTER TABLE ONLY public.login_tokens DROP CONSTRAINT login_tokens_user_id_fkey;
       public          postgres    false    3391    189    293            +           2606    34067 4   product_materials product_materials_material_id_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.product_materials
    ADD CONSTRAINT product_materials_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.materials(id) ON UPDATE CASCADE ON DELETE CASCADE;
 ^   ALTER TABLE ONLY public.product_materials DROP CONSTRAINT product_materials_material_id_fkey;
       public          postgres    false    261    3457    243            *           2606    34062 3   product_materials product_materials_product_id_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.product_materials
    ADD CONSTRAINT product_materials_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;
 ]   ALTER TABLE ONLY public.product_materials DROP CONSTRAINT product_materials_product_id_fkey;
       public          postgres    false    254    261    3473            &           2606    25170 2   rework_messages rework_messages_assignment_id_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.rework_messages
    ADD CONSTRAINT rework_messages_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.assignments(id) ON UPDATE CASCADE ON DELETE SET NULL;
 \   ALTER TABLE ONLY public.rework_messages DROP CONSTRAINT rework_messages_assignment_id_fkey;
       public          postgres    false    219    201    3405            '           2606    25175 ,   rework_messages rework_messages_user_id_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.rework_messages
    ADD CONSTRAINT rework_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;
 V   ALTER TABLE ONLY public.rework_messages DROP CONSTRAINT rework_messages_user_id_fkey;
       public          postgres    false    189    3391    219            /           2606    34555 (   user_clients user_clients_client_id_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.user_clients
    ADD CONSTRAINT user_clients_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON UPDATE CASCADE ON DELETE CASCADE;
 R   ALTER TABLE ONLY public.user_clients DROP CONSTRAINT user_clients_client_id_fkey;
       public          postgres    false    3411    294    205            .           2606    34550 &   user_clients user_clients_user_id_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.user_clients
    ADD CONSTRAINT user_clients_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
 P   ALTER TABLE ONLY public.user_clients DROP CONSTRAINT user_clients_user_id_fkey;
       public          postgres    false    294    189    3391            $           2606    16608 "   user_roles user_roles_role_id_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;
 L   ALTER TABLE ONLY public.user_roles DROP CONSTRAINT user_roles_role_id_fkey;
       public          postgres    false    196    3399    197            #           2606    16603 "   user_roles user_roles_user_id_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
 L   ALTER TABLE ONLY public.user_roles DROP CONSTRAINT user_roles_user_id_fkey;
       public          postgres    false    189    197    3391           